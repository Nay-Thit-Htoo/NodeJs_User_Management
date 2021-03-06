const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const { roleSchema } = require('../models/role');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },

    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
    insertedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
    },
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY);
    return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean().required()
    });

    return schema.validate(user);
}


exports.User = User;
exports.validate = validateUser;