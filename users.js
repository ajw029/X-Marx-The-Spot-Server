var config = require('./my_configs');
var tables = require('./tableconfigs');
var encryption = require("./encrypt");

var user_table = tables.user_table;

/*
var createUserTableQueryString = "CREATE TABLE IF NOT EXISTS " + user_table + "account_id SERIAL PRIMARY KEY NOT NULL, username varchar NOT NULL, password varchar NOT NULL, timestamp timestamp without time zone DEFAULT now())";
db.query(createUserTableQueryString, function(err, res) {
  if (err) throw err
}
*/

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
module.exports.signupAuth = function(req, response) {
  var username = req.body.username;
  var password = req.body.pass;
  var repassword = req.body.repass;
  if (username && password && repassword && password===repassword) {
    //var querystring = "SELECT * FROM " + user_table + "WHERE name="+name + " AND password=" + password;
    // TODO Check if username exists or not
    // db.query(querystring, function(err, res) {
    //   if (err) throw err;
    //   if (res) {
    //     var createaccountstring = "INSERT INTO " + user_table + "(name, password) VALUES (";
    //     createaccountstring += username +"," + password+ ")";
    //     db.query(createaccountstring, function(err2, res2) {
    //       if (err) throw err;
    //
    //       if (res2) {
    //         response.redirect('/signup');
    //       }
    //     });
    //   }
    // });
  }
  else {
    res.redirect('/signup');
  }
};

module.exports.logout = function(req, res) {
  req.session.destroy();
  res.redirect('/login');
};
