const jwt = require("jsonwebtoken");
const passport = require("passport");
const { SECRET } = require("../config");
const Line = require("../models/line");
var router = require('express').Router();

router.post('/addline', (req, res) => {

    const line = new Line({
        ressource: req.body.ressource,
        operation: req.body.operation,
        designation: req.body.designation
    })

    line.save((err, doc) => {
        if (!err) {
            res.status(201).json({
                message: "Line has been added.",
                success: true
            });
        }
    });
});

/**
 * @DESC To delete equipment
 */
router.delete('/deleteLine/:id_line', (req, res) => {

    Line.findByIdAndRemove(req.params.id_line, (err, doc) => {
        if (err) {
            res.json({
                message: 'error',
                success: false
            })
        } else {
            if (doc)
                res.json({
                    message: "line has been deleted!",
                    success: true
                })
            else {
                res.json({
                    message: "couldnt find Line",
                    success: false
                })
            }
        }
    });
})

/**
 * @DESC To update equipment
 */
router.put('/updateline/:id', (req, res) => {
        const id = req.params.id;
        Line.findByIdAndUpdate(id, { $set: req.body }, { new: true }, (err, line) => {
            res.send(line);
        })
    }

);

router.get('/list', (req, res) => {
    Line.find((err, docs) => {
        res.send(docs);
    })
});

module.exports = router;