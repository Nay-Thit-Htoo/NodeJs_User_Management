const winston = require('winston');
const mongoose = require('mongoose');

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}


module.exports = function () {
    mongoose.connect(process.env.DB, connectionParams)
        .then(() => {
            console.log('Connected to database ')
        })
        .catch((err) => {
            console.error(`Error connecting to the database. \n${err}`);
        })
}

// module.exports = function () {
//     mongoose.connect(process.env.DB)
//         .then(() => winston.info('Succesfully Connceted'));
// }