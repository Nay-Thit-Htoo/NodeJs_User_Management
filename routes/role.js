const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const admin = require('../middleware/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { Role, validate } = require('../models/role');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


async function insertNewRole(roleInfo) {
    const { error } = validate(roleInfo);
    if (error) return res.status(400).send("Not allowed");

    let role = await Role.findOne({ roleType: roleInfo.roleType });
    if (role) return role;

    role = new Role(_.pick(roleInfo, ['roleType']));
    return await role.save();
}




//get all role data
router.get('/', auth, async (req, res) => {
    res.send(await Role.find().select().exec());
});


//get each role data by id
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    res.send(await Role.findById(req.params.id).select().exec());
});



//insert new role
router.post('/', [auth, admin], async (req, res) => {
    let role_obj = {
        roleType: req.body.roleType
    }
    role_obj = await insertNewRole(role_obj);
    if (!role_obj) return res.status(400).send('Need User Role Object');
    res.send(await Role.find().select().exec());
});


//update role dat
router.put('/:id', [auth, admin, validateObjectId], async (req, res) => {

    let obj = {
        roleType: req.body.roleType
    }
    const { error } = validate(obj);
    if (error) return res.status(400).send(error.details[0].message);


    let role_object = await Role.findOne({ roleType: req.body.roleType }); //find with role type   
    if ((!role_object) || (role_object && role_object._id != req.params.id)) {
        const role = await Role.findByIdAndUpdate(req.params.id,
            {
                roleType: req.body.roleType,
            }, { new: true });
        if (!role) return res.status(404).send('The role with the given ID was not found.');
        res.send(role);
    }
    else {
        return res.status(400).send('Role already registered.');
    }
})


//delete role data by id
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const role = await Role.findByIdAndRemove(req.params.id);
    if (!role) return res.status(404).send('The role with the given ID was not found.');

    res.send(role);
});





module.exports = { router, insertNewRole }; 
