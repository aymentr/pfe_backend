const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/user");
const Line = require("../models/line");
const Machine = require("../models/machine");
var router = require('express').Router();
var History = require('../models/history');
var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sagemcomp@gmail.com',
        pass: 'ben9asem'
    }
});


router.post('/addLine/:token', (req, res) => {

    const line = new Line({
        _id: req.body.name,
    });
    const io = req.app.get('io');
    try {
        const user_id = jwt.decode(req.params.token.replace('Bearer ', '').trim()).user_id;
        User.findById(user_id, (err, user) => {
            if (!err && user != null) {
                if (user.role === 'superadmin') {
                    line.save((err, doc) => {
                        if (!err) {
                            res.status(201).json({
                                message: "Line has been added.",
                                success: true
                            });
                            io.emit("line_added");
                            const history = new History({
                                table: "Lines",
                                operation: "Add",
                                doc_id: doc._id,
                                username: user.username,
                                updated: doc,
                                user_id: user._id,
                            });

                            history.save((err, h) => {
                                if (!err) io.emit('history');
                            });
                            User.find().exec((err, users) => {
                                users.forEach(user => {
                                    var mailOptions = {
                                        from: 'sagemcomp@gmail.com',
                                        to: user.email,
                                        subject: 'New Line added by: ' + user.username,
                                        text: JSON.stringify(history.toJSON())
                                    };
                                    transporter.sendMail(mailOptions, function(error, info) {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            console.log('Email sent: ' + info.response);
                                        }
                                    });
                                })
                            })
                        } else {
                            res.status(503).json({
                                message: "Line already exist!",
                                success: false
                            })
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
                if (user.role === 'superadmin') {
                    Line.findByIdAndRemove(req.params.id_line, (err, doc) => {
                        if (err) {
                            res.status(400).json({
                                message: 'error',
                                success: false
                            })
                        } else {
                            console.log('deleted')
                            if (doc) {
                                io.emit("line_deleted");
                                Machine.deleteMany().where({ line_id: doc._id }).exec((err, docs) => {
                                    res.json({
                                        message: "line has been deleted!",
                                        success: true
                                    })
                                });
                                const history = new History({
                                    table: "Lines",
                                    operation: "Delete",
                                    doc_id: doc._id,
                                    username: user.username,
                                    updated: doc,
                                    user_id: user._id,
                                });

                                history.save((err, h) => {
                                    if (!err) io.emit('history');
                                });
                                User.find().exec((err, users) => {
                                    users.forEach(user => {
                                        var mailOptions = {
                                            from: 'sagemcomp@gmail.com',
                                            to: user.email,
                                            subject: 'Line deleted by: ' + user.username,
                                            text: JSON.stringify(history.toJSON())
                                        };
                                        transporter.sendMail(mailOptions, function(error, info) {
                                            if (error) {
                                                console.log(error);
                                            } else {
                                                console.log('Email sent: ' + info.response);
                                            }
                                        });
                                    })
                                })
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