var config = require('./my_configs');
var tables = require('./tableconfigs');
var encryption = require("./encrypt");
var db = require('./db');

var user_table = tables.user_table;
var account_table = tables.user_table;
var folder_table = tables.folder_table;

/**
* Render the signup form
*/
module.exports.apiSignUp = function(req, res) {
  var session = req.session.username;
  if (session) {
    res.redirect('/bookmarx');
  }
  else {
    res.render('users/signup.ejs', {errmsg: {hasError: false}});
  }

};

/**
* Render the login form
*/
module.exports.apiLogin = function(req, res) {
  var session = req.session.username;
  if (session) {
    res.redirect('/bookmarx');
  }
  else {
    res.render('users/login.ejs',{errmsg: {hasError: false}});
  }
};

/**
* Verify a user is logged in.  This middleware will be called before every request to the bookmarx directory.
*/
module.exports.apiAuth = function(req, res, next) {
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
* Attempt to login the user.
*/
module.exports.apiLoginAuth = function(req, response) {

  var username = db.escape(req.body.username);
  var password = req.body.pass;

  if (username && password) {
    var queryString = db.squel
    .select()
    .from(user_table)
    .where('username=' + username)
    .toString();

    db.query(queryString,function(err,res){
      if(err) {
        response.status(400).send({errmsg: {message:"Provide username please", hasError: true} });
      } else if(res) {
        // If Null
        if (!res || !res[0]) {
          response.status(400).send({errmsg: {message:"Could not login", hasError: true}});
        }
        //Otherwise check if login matches DB and send appropriate response
        else {
          var queryP = res[0].password;
          if(encryption.encrypt(password.toString())===queryP.toString()){
            req.session.username = encryption.encrypt(res[0].id.toString());
            response.status(200).send({successmsg: true});
          }
          else {
            response.status(200).send({errmsg: {hasError: true, message:"Username and password doesnt' match " }});
          }
        }
      }
    });
  }
  else {
    response.render('users/login.ejs',{errmsg: {message:"Could not login", hasError: true}});
  }
};

/**
* Attempt to Signup the user.
*/
module.exports.apiSignUpAuth = function(req, response) {

  var username = db.escape(req.body.username);
  var password = req.body.pass;
  var repassword = req.body.repass;

  if(password==repassword && password.trim()) {
    // Encrypt Pwd
    var encryptedPwd = encryption.encrypt(password);

    var createUserQueryString = db.squel
    .insert()
    .into(user_table)
    .setFields({
      'username': username.slice(1, -1),
      'password': encryptedPwd
    })
    .toString();

    db.query(createUserQueryString, function (err, res) {
      if (err) {
        //server side failure
        response.render('users/signup.ejs', {errmsg: {message: "Username already exists", hasError: true}});
      } 
      else if (res && res.insertId) {

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
              response.status(500).send({errmsg: "query error"});
            }
            if (folderRes) {
              var queryString = db.squel
              .select()
              .from(user_table)
              .where('username = \'' + username + '\'')
              .toString();

              db.query(queryString, function (err, res) {
                if (err) {
                  response.status(200).send({successmsg: "not in db yet"});
                }
                if (res) {
                  req.session.username = encryption.encrypt(res[0].id.toString());
                  response.status(200).send({successmsg: "signup successful"});
                }
              });
            }
          });
        }
    });
  }
  else {
    response.render('users/signup.ejs',{errmsg: {message:"Passwords don't match", hasError: true}});
  }
};


module.exports.apiUpdatePassword=function(req,res){
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


module.exports.apiLogout = function(req, res) {
  req.session.destroy();
  res.redirect('/login');
};