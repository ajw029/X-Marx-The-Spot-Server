var config = require('./my_configs');
var encryption = require("./encrypt");
/**
 *
 * Render the signup form
 */
module.exports.signup = function(req, res) {
  var session = req.session.username;
  if (session) {
    res.redirect('/bookmarx');
  }
  else {
    res.render('users/signup.ejs');
  }

};

 /**
  * Render the login form
  */
module.exports.login = function(req, res) {
  var session = req.session.username;
  if (session) {
    res.redirect('/bookmarx');
  }
  else {
    res.render('users/login.ejs');
  }
};

/**
 * Verify a user is logged in.  This middleware will be called before every request to the books directory.
 */
module.exports.auth = function(req, res, next) {
  var session = req.session.username;
  if (session) {
    var decryptedSession = encryption.decrypt(session);
    // Validate TODO

    return next();
  }
  else {
    res.redirect('/login');
  }
};

 /**
  *
  * Attempt to login the user.
  */
module.exports.loginAuth = function(req, res) {
  var username = req.body.username;
  var password = req.body.pass;
  if (username && password) {
    // TODO check DB

    // Create a session
    req.session.username = encryption.encrypt(req.body.username);
    res.redirect('/bookmarx');
  }
  else {
    res.redirect('/login');
  }

};

/**
 *
 * Attempt to Signup the user.
 */
module.exports.signupAuth = function(req, res) {
  var username = req.body.username;
  var password = req.body.pass;
  var repassword = req.body.repass;
  if (username && password && repassword && password===repassword) {
    // TODO Check if username exists or not
    res.redirect('/bookmarx');
  }
  else {
    res.redirect('/signup');
  }

};
