const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/user");
const Line = require("../models/line");
const Machine = require("../models/machine");
var router = require('express').Router();

router.post('/addLine/:token', (req, res) => {

    const line = new Line({
        ressource: req.body.ressource,
        operation: req.body.operation,
        designation: req.body.designation
    });
    const io = req.app.get('io');
    try {
        const user_id = jwt.decode(req.params.token.replace('Bearer ', '').trim()).user_id;
        User.findById(user_id, (err, user) => {
            if (!err && user != null) {
                if (User.role !== 'user') {
                    line.save((err, doc) => {
                        if (!err) {
                            res.status(201).json({
                                message: "Line has been added.",
                                success: true
                            });
                            io.emit("line_added");
                        }
                    })
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

/**
 * @DESC To delete equipment
 */
router.delete('/deleteLine/:token/:id_line', (req, res) => {
    const io = req.app.get('io');
    try {
        const id = req.params.id;
        const user_id = jwt.decode(req.params.token.replace('Bearer ', '').trim()).user_id;
        User.findById(user_id, (err, user) => {
            if (!err && user != null) {
                if (User.role !== 'user') {
                    Line.findByIdAndRemove(req.params.id_line, (err, doc) => {
                        if (err) {
                            res.json({
                                message: 'error',
                                success: false
                            })
                        } else {
                            if (doc) {
                                io.emit("line_deleted");
                                Machine.deleteMany().where({ line_id: doc._id }).exec((err, docs) => {
                                    res.json({
                                        message: "line has been deleted!",
                                        success: true
                                    })
                                });
                            } else {
                                res.json({
                                    message: "couldnt find Line",
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
router.put('/updateLine/:token/:id', (req, res) => {
        const io = req.app.get('io');
        try {
            const id = req.params.id;
            const user_id = jwt.decode(req.params.token.replace('Bearer ', '').trim()).user_id;
            User.findById(user_id, (err, user) => {
                if (!err && user != null) {
                    if (User.role !== 'user') {
                        Line.findByIdAndUpdate(id, { $set: req.body }, { new: true }, (err, line) => {
                            res.send(line);
                        }).then(() => io.emit("line_updated"));
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

router.get('/list', (req, res) => {
    Line.find((err, docs) => {
        res.send(docs);
    })
});

router.get('/line/:id', (req, res) => {
    Line.findById(req.params.id, (err, docs) => {
        res.send(docs);
    })
});

module.exports = router;