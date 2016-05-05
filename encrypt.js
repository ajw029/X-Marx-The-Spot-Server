var config = require('./my_configs');

var crypto = require('crypto'),
    algorithm = config.ECRYPT_KEY,
    password = config.ENCRYPT_PASS;

module.exports.encrypt = function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

module.exports.decrypt = function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
