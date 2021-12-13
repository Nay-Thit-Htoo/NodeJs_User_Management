module.exports = function () {
    if (!process.env.JWTPRIVATEKEY) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }
}