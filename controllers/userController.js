var router = require('express').Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/user");
const { SECRET } = require("../config");


router.get('/Allusers', (req, res) => {
    User.find().select("-password").exec((err, docs) => {
        res.send(docs);
    });
});

router.post('/add', (req, res) => {
    bcrypt.hash(req.body.password, 12).then((crypted) => {
        req.body.password = crypted;
        var user = new User(req.body);
        user.save((err, doc) => {
            if (!err) {
                res.send(doc);
            }
        });
    })
});




router.post('/login', (req, res) => {
    let password = req.body.password;
    // First Check if the username is in the database
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            res.status(404).json({
                message: "Email is not found. Invalid login credentials.",
                success: false
            });
        } else {
            // Now check for the password
            bcrypt.compare(password, user.password).then((match) => {
                let isMatch = (match);
                if (isMatch) {
                    // Sign in the token and issue it to the user
                    let token = jwt.sign({
                            user_id: user._id,
                            role: user.role
                        },
                        SECRET, { expiresIn: "7 days" }
                    );

                    let result = {
                        token: `Bearer ${token}`,
                    };

                    res.status(200).send({
                        ...result,
                        message: "Hurray! You are now logged in.",
                        success: true
                    });
                } else {
                    res.status(403).send({
                        message: "Incorrect password.",
                        success: false
                    });
                }
            });

        }

    });

});


router.put('/checkRole', (req, res) => {
    try {
        const id = jwt.decode(req.body.token.replace('Bearer ', '')).user_id;
        User.findById(id, (err, user) => {
            if (!err && user != null) {
                res.send({ role: user.role });

            } else {
                res.send(null);
            }
        })
    } catch {
        res.send(null);
    }

});

router.get("/userbyname", async(req, res) => {
    const user = await user.find({ name: req.body.name });
    if (user) {
        res.status(200).json({
            user,
            success: true,
        });
    } else {
        res.status(400).json({
            message: 'couldn\'t find any user with that name',
            success: false,
        });
    }
});

router.get("/userbyId", async(req, res) => {
    const user = await user.findOne({ id: req.params.id });
    if (user) {
        res.status(200).json({
            user,
            success: true,
        });
    } else {
        res.status(400).json({
            message: 'couldn\'t find anyuser with that name',
            success: false,
        });
    }
});

router.put('/edit-profile', async(req, res) => {
    const id = req.params.id;
    const user = await User.findOne({ _id: id }, (err, foundObject) => {
        if (err) {
            res.status(500).json({
                message: "Error, check updateProfile",
                success: false
            });
        } else {
            if (!foundObject) {
                res.status(404).json({
                    message: "Error, user id not found",
                    success: false
                });
            } else {
                if (req.body.username) {
                    foundObject.username = req.body.username
                }
                if (req.body.name) {
                    foundObject.name = req.body.name
                }
                if (req.body.email) {
                    foundObject.email = req.body.email
                }
                if (req.body.password) {
                    foundObject.password = req.body.password
                }


                foundObject.save(function(err) {
                    if (err) {
                        res.status(500).json({
                            message: "Error, couldn't save user!",
                            success: false
                        });
                    } else {
                        res.status(201).json({
                            message: 'User info has been updated successfully!',
                            success: true
                        });
                    }
                })
            }
        }
    });
});


module.exports = router