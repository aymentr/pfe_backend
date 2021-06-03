var router = require('express').Router();
var History = require('../models/history');

router.get('/list', (req, res) => {
    History.find().sort({ updatedAt: -1 }).exec((err, docs) => {
        if (!err) {
            res.send(docs);
        }
    })
});


router.get('/check', (req, res) => {
    const io = req.app.get('io');
    History.find().where({ seen: false }).exec((err, arr) => {
        let i = 0;
        arr.forEach((doc) => {
            i++;
            History.findByIdAndUpdate(doc._id, { $set: { seen: true } }, { new: true }, (err, h) => {
                if (i === arr.length) {
                    io.emit('history');
                    res.send(true);
                }
            });
        });
    });
});

router.get('/unseen', (req, res) => {
    History.find().where({ seen: false }).countDocuments((err, result) => {
        if (!err) {
            res.send({ count: result });
        }
    })
});

module.exports = router;