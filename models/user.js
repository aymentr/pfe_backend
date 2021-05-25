const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "superadmin"]
    },
    username: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = model("users", UserSchema);