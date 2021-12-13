const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function () {
    mongoose.connect(process.env.DB)
        .then(() => winston.info('Connected to MongoDB...'));
}