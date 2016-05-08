var config = require('./my_configs');
var tables = require('./tableconfigs');
var encryption = require("./encrypt");
var db = require('./db');

var user_table = tables.user_table;
var account_table = tables.user_table;

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
    req.body.account_id = parseInt(decryptedSession);
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
module.exports.loginAuth = function(req, response) {

  var username = req.body.username;
  var password = req.body.pass;

  if (username && password) {
    var queryString="SELECT * from "+ user_table +" WHERE username="+ "\"" + username + "\"";
    db.query(queryString,function(err,res){

      if(err){
        response.redirect('/login');
      }else if(res){
        // If Null
        if (!res || !res[0]) {
          response.redirect('/login');
        }
        else {
          var queryP = res[0].password;
          if(password.toString()==queryP.toString()){
            req.session.username = encryption.encrypt(res[0].id.toString());
            response.redirect('/bookmarx');
          }
          else {
            response.redirect('/login');
          }
        }
      }
    });
  }
  else {
    response.redirect('/login');
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

  if(password==repassword){

     var queryString="SELECT username from "+ user_table +" WHERE username="+ "\"" + username+ "\"";

      db.query(queryString,function(err,res){

      if(err){
        response.redirect('/signup');
      }if(res){
        if(res[0]){
          response.redirect('/signup');
        }else {
          // not exists create new one
          var createUserQueryString="INSERT INTO "+ user_table+" (username,password) values ("+ "\"" +username+"\"" +","+"\"" +password+"\"" +");"
          db.query(createUserQueryString,function(err,res){
            if(err){
            }else if(res){
              var getAccountId="SELECT * from "+ user_table +" WHERE username="+ "\"" + username + "\"";
              db.query(getAccountId,function(err, accountId){
                req.session.username = encryption.encrypt(accountId[0].id);
                response.redirect('/login');
              });
            }
          });
        }

      }
   });
  }
    else {
    res.redirect('/signup');
  }
};

module.exports.logout = function(req, res) {
  req.session.destroy();
  res.redirect('/login');
};
