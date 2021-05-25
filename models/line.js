const { Schema, model } = require("mongoose");

const LineSchema = new Schema({
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
    }
});

module.exports = model("line", LineSchema);