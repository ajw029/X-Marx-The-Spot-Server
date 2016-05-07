var config = require('./my_configs');
var tables = require('./tableconfigs');
var encryption = require("./encrypt");
var db = require('./db');
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

    var queryString="SELECT password from"+ user_table +"WHERE username="+username;

    db.query(queryString,function(err,res){

      if(err){

        console.log("err"+err);
         res.redirect('/login');

      }else if(res){
          console.log("incallback "+res[0]);
          if(password=res[0].password){
          }
          req.session.username = encryption.encrypt(req.body.username);
          res.redirect('/bookmarx');
      }
    
    });

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


  if(password==repassword){

     var queryString="SELECT EXISTS(SELECT username from"+ user_table +"WHERE username="+username+")";

      db.query(queryString,function(err,res){

      if(err){

        console.log("err"+err);
         res.redirect('/signup');

      }if(res){
        //check if username exists
        if(res[0]=='1'){
          console.log("account exists");
        }else {
          // not exists create new one
          var createUserQueryString="INSERT INTO"+ user_table+" (username,password) values ("+username+","+password+");"
          db.query(createUserQueryString,function(err,res){
            if(err){
              console.log("err"+err);
            }else if(res){
              console.log("res"+res);
              res.redirect('/login');
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
