var db = require('./db');
var tables = require('./tableconfigs');

var folder_table = tables.folder_table;
var user_table = tables.user_table;
var bookmarx_table = tables.bookmarx_table;
var keywords_table = tables.keywords_table;
var keywords_relation_table = tables.keywords_relation_table;

/**
 *
 * Renders page to add a bookmark
 */
var add = module.exports.add = function(req, res) {
  res.render('bookmarx/add.ejs');
};
/**
 *
 * Allows a user to add a bookmark
 */
var addBookmarxAuth = module.exports.addBookmarxAuth = function(req, res) {

  var bookmarx_title = db.escape(req.body.title);
  var bookmarx_url = db.escape(req.body.url);
  var bookmarx_desc = db.escape(req.body.desc);
  var bookmarx_keywords = db.escape(req.body.keywords);
  var bookmarx_folder_id = db.escape(req.body.folder_id);

  // TODO validate
  if (bookmarx_title &&
      bookmarx_url   &&
      bookmarx_desc  &&
      bookmarx_keywords &&
      bookmarx_folder) {
        // TODO Insert into DB

        var querystring = "INSERT INTO " + bookmarx_table + " (bookmarx_id , folder_id, bookmarx_name, description, url, isfavorite) VALUES(";
        querystring += "TODOID"+ "," + bookmarx_folder_id + "," + bookmarx_title +","+ bookmarx_desc + "," + bookmarx_url + "," + false + ")";

        res.redirect('/bookmarx');
  }
  else {
    res.render('bookmarx/add.ejs');
  }
};


/**
 *
 * Selects all books and then renders the page with the list.ejs template
 */
var list = module.exports.list = function(req, res) {
  var folder_id = db.escape(req.params.folder_id);

  if (folder_id) {
    // TODO
    var queryString = "SELECT * FROM " + bookmarx_table + " WHERE folder_id="+folder_id;
    db.query(queryString, function(err, res) {
      if (err){
        throw err;
      }
      else {
        res.render('bookmarx/list.ejs');
      }
    });
  }
  else {
    // TODO
    var queryString = "SELECT * FROM " + bookmarx_table + " JOIN " + folder_table + " ON " +bookmarx_table+".folder_id=" +folder_table+".folder_id WHERE " +folder_table +".name=default";
    res.render('bookmarx/list.ejs');
  }
};

/**
 *
 * Deletes a bookmarx
 */
var deleteBookmarx = module.exports.deleteBookmarx =  function(req, res) {
  var bookmarx_id = db.escape(req.body.bookmarx_id);

  res.render('bookmarx/delete.ejs');
};

var deleteBookmarxAuth = module.exports.deleteBookmarxAuth =  function(req, res) {
  var bookmarx_id = db.escape(req.body.bookmarx_id);
  var querystring = "DELETE FROM " + bookmarx_table + " where bookmarx_id=" +  bookmarx_id;

  res.redirect('/bookmarx');
};

var foldersettings = module.exports.foldersettings =  function(req, res) {
  res.render('bookmarx/foldersettings.ejs');
};

var addfolder = module.exports.addfolder =  function(req, res) {
  var folder_title = db.escape(req.body.folder_title);
  var account_id = db.escape(req.body.account_id);
  var querystring = "INSERT INTO " + folder_table + " (folder_id, account_id, folder_name) VALUES(" + "TODOid" +"," + account_id +"," + folder_title+ ")";

  res.render('bookmarx/addfolder.ejs');
};

var settings = module.exports.settings =  function(req, res) {
  res.render('bookmarx/settings.ejs');
};

var edit = module.exports.edit =  function(req, res) {
  var bookmarx_title = db.escape(req.body.title);
  var bookmarx_url = db.escape(req.body.url);
  var bookmarx_desc = db.escape(req.body.desc);
  var bookmarx_keywords = db.escape(req.body.keywords);
  var bookmarx_folder = db.escape(req.body.folder_id);
  var bookmarx_id = db.escape(req.params.bookmarx_id);

  // TODO validate
  if (bookmarx_title &&
      bookmarx_url   &&
      bookmarx_desc  &&
      bookmarx_keywords &&
      bookmarx_folder) {
        var querystring = "UPDATE " + bookmarx_table + "SET ";
        querystring += "bookmarx_folder="+bookmarx_folder+ ", bookmarx_name="+ bookmarx_title +", description=" +bookmarx_desc + ", url=" + bookmarx_url;
        querystring += " WHERE bookmarx_id="+bookmarx_id;
        res.redirect('/bookmarx');
  }
  else {
    res.render('bookmarx/edit.ejs');
  }
};

var staraction = module.exports.staraction =  function(req, res) {
  var bookmarx_id = db.escape(req.body.bookmarx_id);
  // TODO
  // var select_queryString = "SELECT isfavorite FROM " + bookmarx_folder + " WHERE bookmarx_id="+bookmarx_id;
  // db.query(select_queryString, function(err, res) {
  //   if (err) throw err;
  //   if (res) {
  //     var isFavorite;
  //     var querystring = "UPDATE " + bookmark_table + "SET ";
  //     querystring += "isfavorite="+isFavorite;
  //     querystring += " WHERE bookmarx_id="+bookmarx_id;
  //     res.redirect('/bookmarx')
  //   }
  // });
};
