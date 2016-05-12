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
    res.render('users/signup.ejs',{errmsg: {hasError: false}});
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
    res.render('users/login.ejs', {errmsg: {hasError: false}});
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
    var queryString = db.squel
    .select()
    .from(user_table)
    .where('username = \'' + username + '\'')
    .toString();

    db.query(queryString,function(err,res){

      if(err){
        response.render('users/login.ejs',{errmsg: {message:"can not be null ", hasError: true} });
      }else if(res){
        // If Null
        if (!res || !res[0]) {
          response.render('users/login.ejs',{errmsg: {message:"User doesn't exist", hasError: true}});
        }
        else {

          var queryP = res[0].password;
          if(encryption.encrypt(password.toString())===queryP.toString()){
            req.session.username = encryption.encrypt(res[0].id.toString());
            response.redirect('/bookmarx');
          }
          else {
            response.render('users/login.ejs', {errmsg: {hasError: true,message:"User name and password not match " }});
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

  if(password==repassword && password.trim()) {
    // Encrypt Pwd
    var encryptedPwd = encryption.encrypt(password);

    var createUserQueryString = db.squel
    .insert()
    .into(user_table)
    .setFields({
      'username': username,
      'password': encryptedPwd
    })
    .toString();

    db.query(createUserQueryString, function (err, res) {
      if (err) {
        //server side failure
        response.render('users/signup.ejs', {errmsg: {message: "server error ", hasError: true}});
      } else if (res) {
        if (err) {
        } else if (res && res.insertId) {

          var createDefaultFolder = db.squel
          .insert()
          .into(folder_table)
          .setFields({
            'account_id': res.insertId,
            'name': 'Default'
          })
          .toString();
          db.query(createDefaultFolder, function (err, folderRes) {
            if (err) {
              throw err;
              response.render('users/signup.ejs', {
                errmsg: {
                  message: "server error ",
                  hasError: true
                }
              });
            }
            if (folderRes) {
              var queryString = db.squel
              .select()
              .from(user_table)
              .where('username = \'' + username + '\'')
              .toString();
              db.query(queryString, function (err, res) {
                if (err) {
                  console.log(err)
                  response.redirect('/login');
                }
                if (res) {
                  req.session.username = encryption.encrypt(res[0].id.toString());
                  response.redirect('/bookmarx');
                }
              });
            }
          });
        }
      }
    });
  }
  else {
    response.render('users/signup.ejs',{errmsg: {message:"Password and comfirm password not match", hasError: true}});
  }
};


module.exports.updatepassword=function(req,res){
  var account_id = db.escape(req.body.account_id);

  var oldPassword=req.body.oldPassword;
  var newPassword=req.body.newPassword;
  var reNewPassword=req.body.reNewPassword;

  if(oldPassword&&newPassword&&reNewPassword){
    if(newPassword==reNewPassword){

      var queryPasswordString = db.squel
      .select()
      .from(user_table)
      .where('id=' + db.escape(account_id) + '')
      .toString();

      db.query(queryPasswordString,function(err,res1){
        if(err){
          throw err;
          res.redirect('/bookmarx/settings');
        }

        if(res1[0] && res1[0].password==encryption.encrypt(oldPassword)){

          var updatePasswordQuery = db.squel
          .update()
          .table(user_table)
          .set('password', encryption.encrypt(newPassword))
          .where('id=' + db.escape(account_id))
          .toString();

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
