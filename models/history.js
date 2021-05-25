const { Schema, model } = require("mongoose");

const History = new Schema({
    table: {
        type: String,
        required: false
    },
    operation: {
        type: String,
        required: true
    },
    doc_id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: false
    },
    user_id: {
        type: String,
        required: false
    },
    UpdatedAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = model("line", LineSchema);