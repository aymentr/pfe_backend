const { Schema, model } = require("mongoose");

const MachineSchema = new Schema({
    _id: {
        type: String,
        required: false
    },
    server: {
        type: String,
        required: true
    },
    operation: {
        type: String,
        required: true
    },
    mode: {
        type: Boolean,
        required: false
    },
    line_id: {
        type: String,
        required: true
    }
});

module.exports = model("machine", MachineSchema);