var config = require('./my_configs');
var tables = require('./tableconfigs');
var encryption = require("./encrypt");
var db = require('./db');

var user_table = tables.user_table;
var account_table = tables.user_table;
var folder_table = tables.folder_table;

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
    res.render('users/login.ejs',{errmsg: {hasError: false}});
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
    res.render('/login',{errmsg: {hasError: false}});
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
        response.render('users/login.ejs',{errmsg: {message:"can not be null ", hasError: true} });
      }else if(res){
        // If Null
        if (!res || !res[0]) {
          response.render('users/login.ejs',{errmsg: {message:"not exit", hasError: true}});
        }
        else {

          var queryP = res[0].password;
          if(encryption.encrypt(password.toString())==queryP.toString()){
            req.session.username = encryption.encrypt(res[0].id.toString());
            response.redirect('/bookmarx');
          }
          else {
            response.render('users/login.ejs', {errmsg: {hasError: true,message:"password not match " }});
          }
        }
      }
    });
  }
  else {
    response.render('users/login.ejs',{errmsg: {message:"can not be null ", hasError: true}});
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

  if(password==repassword && password.trim()){

     var queryString="SELECT username from "+ user_table +" WHERE username="+ "\"" + username+ "\"";

      db.query(queryString,function(err,res){

      // Redirect back to Sign Up if Account Exists
      if(err || res[0]){
        response.redirect('/signup');
      }if(res && !res[0]){
        // not exists create new one

        // Encrypt Pwd
        var encryptedPwd = encryption.encrypt(password);
        var createUserQueryString="INSERT INTO "+ user_table+" (username,password) values ("+ "\"" +username+"\"" +","+"\"" +encryptedPwd+"\"" +");"
        db.query(createUserQueryString,function(err,res){
          if(err){
          }else if(res){
            var getAccountId="SELECT * from "+ user_table +" WHERE username="+ "\"" + username + "\"";
            db.query(getAccountId,function(err, accountId){
              var createDefaultFolder = "INSERT INTO " + folder_table + " (account_id, name) VALUES(" +db.escape(accountId[0].id.toString()) +", 'Default' )";
              db.query(createDefaultFolder,function(err, folderRes){
                if (err) {
                  throw err;
                }
                if (folderRes) {
                  req.session.username = encryption.encrypt(accountId[0].id.toString());
                  response.redirect('/login');
                }
              });

            });

          }
        });

      }
   });
  }
  else {
    response.redirect('/signup');
  }
};


module.exports.updatepassword=function(req,res){
  var account_id = db.escape(req.body.account_id);

  var oldPassword=req.body.oldPassword;
  var newPassword=req.body.newPassword;
  var reNewPassword=req.body.reNewPassword;

  if(oldPassword&&newPassword&&reNewPassword){
    if(newPassword==reNewPassword){
        var queryPasswordString="SELECT password from "+ user_table +" WHERE id="+  account_id;
        db.query(queryPasswordString,function(err,res1){
          if(err){
            throw err;
            res.redirect('/bookmarx/settings');
          }

          if(res1[0] && res1[0].password==encryption.encrypt(oldPassword)){

            var updatePasswordQuery="UPDATE "+ user_table+" set password=" + db.escape(encryption.encrypt(newPassword))+ " where id="+account_id;
            db.query(updatePasswordQuery,function(err,res2){
              if(err){
                throw err;
                res.redirect('/bookmarx/settings');
              }
              if(res2){
                res.redirect('/bookmarx');
              }
            });
          }
          else {
            res.redirect('/bookmarx/settings');
          }

        });

    }else{
      res.redirect('/bookmarx/settings');
    }
  }

};


module.exports.logout = function(req, res) {
  req.session.destroy();
  res.redirect('/login');
};
