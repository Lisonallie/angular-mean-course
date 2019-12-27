const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

//Add unique validator plugin to get an error if it tries to save a user with an email that already exists
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);