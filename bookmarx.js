/*  TODO: Add Function Blocks

 */

var db = require('./db');

/**
 *
 * Allows a user to add a bookmark
 */
var add = module.exports.add = function(req, res) {
  res.render('bookmarx/add.ejs');
}

var addBookmarxAuth = module.exports.addBookmarxAuth = function(req, res) {

  var bookmarx_title = db.escape(req.body.title);
  var bookmarx_url = db.escape(req.body.url);
  var bookmarx_desc = db.escape(req.body.desc);
  var bookmarx_keywords = db.escape(req.body.keywords);
  var bookmarx_folder = db.escape(req.body.folder);

  // TODO validate
  if (bookmarx_title &&
      bookmarx_url   &&
      bookmarx_desc  &&
      bookmarx_keywords &&
      bookmarx_folder) {
        // TODO Insert into DB

        res.redirect('/bookmarx');
  }
  else {
    res.render('bookmarx/add.ejs');
  }
}


/**
 *
 * Selects all books and then renders the page with the list.ejs template
 */
var list = module.exports.list = function(req, res) {
  var folder_id = req.params.folder_id;
  if (folder_id) {
    console.log('hi')
  }
  else {
    res.render('bookmarx/list.ejs');
  }
};

var deleteBookmarx = module.exports.deleteBookmarx =  function(req, res) {
  res.render('bookmarx/delete.ejs');
}

var deleteBookmarxAuth = module.exports.deleteBookmarxAuth =  function(req, res) {
  var bookmarx_id = db.escape(req.body.bookmarx_id);

  res.redirect('/bookmarx');
}

var foldersettings = module.exports.foldersettings =  function(req, res) {
  res.render('bookmarx/foldersettings.ejs');
}

var edit = module.exports.edit =  function(req, res) {
  res.render('bookmarx/edit.ejs');
}
