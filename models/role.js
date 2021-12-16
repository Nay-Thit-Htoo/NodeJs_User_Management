const Joi = require('joi');
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    roleType: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50

    },
    insertedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
});

const Role = mongoose.model('Role', roleSchema);

function validateRole(role) {
    const schema = Joi.object({
        roleType: Joi.string().min(5).max(50).required(),
    });

    return schema.validate(role);
}


exports.roleSchema = roleSchema;
exports.Role = Role;
exports.validate = validateRole;