const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const emailValidator = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username must be non-empty'],
        minLength: 3,
        maxLength: 50,
    },
    password: {
        type: String,
        required: [true, 'Password must be provided'],
        minLength: 8,
    },
    email: {
        type: String,
        match: [emailValidator, 'Invalid email provided'],
        maxLength: 50,
    },
});

// never store the password in the token
userSchema.methods.createJWT = function () {
    const token = jwt.sign({ username: this.username, userID: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
    return token;
}

userSchema.methods.checkPasswordValidity = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Users = mongoose.model('User', userSchema);

module.exports = Users;