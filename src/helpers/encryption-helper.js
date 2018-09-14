var crypto = require('crypto'),
    config = require('../config/config.js');
    algorithm = 'aes256';

exports.encrypt = function (plainText) {
    var cipher = crypto.createCipher(algorithm, config.ENC_SECRET)
    var crypted = cipher.update(plainText, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

exports.decrypt = function (encryptedText) {
    var decipher = crypto.createDecipher(algorithm, config.ENC_SECRET)
    var dec = decipher.update(encryptedText, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}
