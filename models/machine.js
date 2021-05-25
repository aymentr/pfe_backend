const { Schema, model } = require("mongoose");

const MachineSchema = new Schema({
    ressource: {
        type: String,
        required: false
    },
    operation: {
        type: String,
        required: true
    },

    designation: {
        type: String,
        required: false
    },
    line_id: {
        type: String,
        required: true
    }
});

module.exports = model("machine", MachineSchema);