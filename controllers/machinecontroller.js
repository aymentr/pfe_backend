const Machine = require("../models/machine");
var router = require('express').Router();

router.post('/addMachine', (req, res) => {

    const machine = new Machine({
        ressource: req.body.ressource,
        operation: req.body.operation,
        designation: req.body.designation,
        line_id: req.body.line_id
    })

    machine.save((err, doc) => {
        if (!err) {
            res.status(201).json({
                message: "machine has been added.",
                success: true
            });
        }
    });
});

router.get('/machinesByLine/:line_id', (req, res) => {
    Machine.find().where({ line_id: req.params.line_id }).exec((err, docs) => {
        res.send(docs);
    })
});

/**
 * @DESC To delete equipment
 */
router.delete('/deleteMachine/:id_line', (req, res) => {

    Machine.findByIdAndRemove(req.params.id_line, (err, doc) => {
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
router.put('/updateMachine/:id', (req, res) => {
        const id = req.params.id;
        Machine.findByIdAndUpdate(id, { $set: req.body }, { new: true }, (err, line) => {
            res.send(line);
        })
    }

)

module.exports = router;