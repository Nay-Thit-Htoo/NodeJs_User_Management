const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const Role = require('../routes/role');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//login user
router.post('/login', auth, async (req, res) => {

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User Not Found");
    bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (result)
            return res.status(200).send(await User.findOne({ email: req.body.email }).populate('role').select('-__v').exec());
        else
            return res.status(400).send("User Login Failed!");
    });

});

//get all user's data
router.post('/getUserData', [auth, admin], async (req, res) => {

    const token = new User().generateAuthToken();
    res.header('x-auth-token', token).send(await User.find().populate('role').select('-__v').exec());
    //res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
});



//get user data by id
router.get('/:id', [auth, validateObjectId], async (req, res) => {
    //const user = await User.findById(req.params.id).select(); for single collection
    const user = await User.findById(req.params.id).populate('role').select('-__v').exec();//for reference collections
    res.send(user);
});


//insert new user
router.post('/', async (req, res) => {
    let role_obj = {
        roleType: req.body.roleType
    }
    role_obj = await Role.insertNewRole(role_obj);
    if (!role_obj) return res.status(400).send('Need User Role Object');

    let user_obj = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin
    };

    const { error } = validate(user_obj);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: user_obj.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(user_obj, ['name', 'email', 'password', 'isAdmin']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.role = role_obj._id;
    await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(await User.findById(user._id).populate('role').select('-__v').exec());
});


//delete user data by userid
router.delete('/:id', [auth, validateObjectId], async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send('The user with the given ID was not found.');

    res.send(user);
});

//update user data by user id
router.put('/:id', [auth, validateObjectId], async (req, res) => {

    let reqBody = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin
    };

    const { error } = validate(reqBody);
    if (error) return res.status(400).send(error.details[0].message);
    let user_object = await User.findOne({ email: req.body.email }); //find with email   
    if ((!user_object) || (user_object && user_object._id != req.params.id)) {
        const salt = await bcrypt.genSalt(10);
        const user = await User.findByIdAndUpdate(req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, salt),
                isAdmin: req.body.isAdmin,
                role: req.body.roleId
            }, { new: true });
        if (!user) return res.status(404).send('The user with the given ID was not found.');
        res.send(user);
    }
    else {
        return res.status(400).send('User already registered.');
    }
});








module.exports = router; 