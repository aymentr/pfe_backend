const Machine = require("../models/machine");
const User = require("../models/user");
const History = require("../models/history");
var router = require('express').Router();
var jwt = require('jsonwebtoken');

router.post('/addMachine/:token', (req, res) => {

    const machine = new Machine({
        _id: req.body.ressource.toUpperCase(),
        server: req.body.server,
        operation: req.body.operation.toUpperCase(),
        mode: req.body.mode,
        line_id: req.body.line_id
    });
    const io = req.app.get('io');
    try {
        const user_id = jwt.decode(req.params.token.replace('Bearer ', '').trim()).user_id;
        User.findById(user_id, (err, user) => {
            if (!err && user != null) {
                if (User.role !== 'user') {
                    machine.save((err, doc) => {
                        if (!err) {
                            res.status(201).json({
                                message: "machine has been added.",
                                success: true
                            });
                            io.emit("machine_added");
                            const history = new History({
                                table: "Machines",
                                operation: "Add",
                                doc_id: doc._id,
                                username: user.username,
                                updated: doc,
                                user_id: user._id,
                            });

                            history.save((err, h) => {
                                if (!err) io.emit('history');
                            })
                        } else {
                            res.status(503).json({
                                message: "Machine ressource already exist!",
                                success: false
                            })
                        }
                    });
                } else {
                    res.status(403).json({
                        message: "Access denied! You are not authorized!",
                        success: false,
                    });
                }

            } else {
                res.status(403).json({
                    message: "Access denied! You are not authorized!",
                    success: false,
                });
            }
        })
    } catch {
        res.status(403).json({
            message: "Access denied! You are not authorized!",
            success: false,
        });
    }
});

router.get('/machinesByLine/:line_id', (req, res) => {
    Machine.find().where({ line_id: req.params.line_id }).exec((err, docs) => {
        res.send(docs);
    })
});

/**
 * @DESC To delete equipment
 */
router.delete('/deleteMachine/:token/:id', (req, res) => {
    const io = req.app.get('io');
    try {
        const id = req.params.id;
        const user_id = jwt.decode(req.params.token.replace('Bearer ', '').trim()).user_id;
        User.findById(user_id, (err, user) => {
            if (!err && user != null) {
                if (user.role === 'superadmin') {
                    Machine.findByIdAndRemove(req.params.id, (err, doc) => {
                        if (err) {
                            res.json({
                                message: 'error',
                                success: false
                            })
                        } else {
                            if (doc) {
                                io.emit("machine_deleted");
                                const history = new History({
                                    table: "Machines",
                                    operation: "Delete",
                                    doc_id: doc._id,
                                    username: user.username,
                                    updated: doc,
                                    user_id: user._id,
                                });

                                history.save((err, h) => {
                                    if (!err) io.emit('history');
                                })

                            } else {
                                res.json({
                                    message: "couldn't find Machine",
                                    success: false
                                })
                            }
                        }
                    });
                } else {
                    res.status(403).json({
                        message: "Access denied! You are not authorized!",
                        success: false,
                    });
                }

            } else {
                res.status(403).json({
                    message: "Access denied! You are not authorized!",
                    success: false,
                });
            }
        })
    } catch {
        res.status(403).json({
            message: "Access denied! You are not authorized!",
            success: false,
        });
    }

})

/**
 * @DESC To update equipment
 */
router.put('/updateMachine/:token/:id', (req, res) => {
        const io = req.app.get('io');
        try {
            const id = req.params.id;
            const user_id = jwt.decode(req.params.token.replace('Bearer ', '').trim()).user_id;
            User.findById(user_id, (err, user) => {
                if (!err && user != null) {
                    if (User.role !== 'user') {
                        Machine.findByIdAndUpdate(id, { $set: req.body }, { new: true }, (err, machine) => {
                            res.send(machine);
                            const history = new History({
                                table: "Machines",
                                operation: "Update",
                                doc_id: machine._id,
                                username: user.username,
                                updated: machine,
                                user_id: user._id,
                            });

                            history.save((err, h) => {
                                if (!err) io.emit('history');
                            })
                        }).then(() => {
                            io.emit("machine_updated");
                        });

                    } else {
                        res.status(403).json({
                            message: "Access denied! You are not authorized!",
                            success: false,
                        });
                    }

                } else {
                    res.status(403).json({
                        message: "Access denied! You are not authorized!",
                        success: false,
                    });
                }
            })
        } catch {
            res.status(403).json({
                message: "Access denied! You are not authorized!",
                success: false,
            });
        }
    }

);
router.get('/listMachine', (req, res) => {
    Machine.find((err, docs) => {
        res.send(docs);
    })
});


module.exports = router;