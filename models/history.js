const { Schema, model } = require("mongoose");

const History = new Schema({
    table: {
        type: String,
        enum: ["Lines", "Machines"]
    },
    operation: {
        type: String,
        enum: ["Add", "Update", "Delete"]
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
    updated: { type: Object },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    seen: { type: Boolean, default: false }
});

module.exports = model("history", History);