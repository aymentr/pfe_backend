const { Schema, model } = require("mongoose");

const LineSchema = new Schema({
    _id: { type: String }
});

module.exports = model("line", LineSchema);