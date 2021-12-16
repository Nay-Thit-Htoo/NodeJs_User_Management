const express = require('express');
const users = require('../routes/users');
const auth = require('../middleware/auth');
const error = require('../middleware/error');
const role = require('../routes/role');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/role', role.router);
    app.use(error);

}