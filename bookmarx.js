var db = require('./db');
var tables = require('./tableconfigs');

var folder_table = tables.folder_table;
var user_table = tables.user_table;
var bookmarx_table = tables.bookmarx_table;
var keywords_table = tables.keywords_table;
var account_table = tables.user_table;

/**
 * Renders page to add a bookmark
 */
var add = module.exports.add = function(req, response) {
  var account_id = req.body.account_id;
  var queryFolderListString = "SELECT * FROM " + folder_table+" WHERE account_id="+account_id;

  db.query(queryFolderListString, function(err, folderRes) {
    if (err) {
      throw err;
    }
    if (folderRes) {
      response.render('bookmarx/add.ejs', {foldersList: folderRes});
    }
  });
};

/**
 * Allows a user to add a bookmark
 */
var addBookmarxAuth = module.exports.addBookmarxAuth = function(req, response) {

  var bookmarx_title = db.escape(req.body.title);
  var bookmarx_url = db.escape(req.body.url);
  var bookmarx_desc = db.escape(req.body.desc);
  var bookmarx_keywords = db.escape(req.body.keywords);
  var bookmarx_folder_id = db.escape(req.body.folder);
  var account_id = db.escape(req.body.account_id);

  if (bookmarx_title &&
      bookmarx_url   &&
      bookmarx_desc  &&
      bookmarx_keywords &&
      bookmarx_folder_id) {
        var queryString = "INSERT INTO " + bookmarx_table + " (folder_id, account_id, name, url, description, favorite)";
        queryString += " VALUES(" + bookmarx_folder_id + "," + account_id + "," + bookmarx_title + "," + bookmarx_url + "," + bookmarx_desc + "," + false +")";

        db.query(queryString, function(err, res) {
          if (err){
            //throw err;
            response.redirect('/bookmarx/add');
          }
          if (res) {
            // Insert Keywords
            response.redirect('/bookmarx');
          }
        });
  }
  else {
    response.render('bookmarx/add.ejs');
  }
};

/**
 *
 * Selects all books and then renders the page with the list.ejs template
 */
var list = module.exports.list = function(req, response) {
  var folder_id =  req.params.folder_id;
  var account_id = req.body.account_id;

  var queryFolderListString = "SELECT * FROM " + folder_table+" WHERE account_id="+account_id;

  db.query(queryFolderListString, function(err, folderRes) {
      if (err){
        throw err;
      }
      if (folderRes) {
        if (folder_id) {
          // TODO
          var queryString = "SELECT * FROM " + bookmarx_table + " WHERE folder_id=" + folder_id;

          db.query(queryString, function(err, res) {
            if (err){
              throw err;
            }
            if (res) {
              response.render('bookmarx/list.ejs', {bookmarxList: res,
                                                    folderList: folderRes});
            }
          });
        }
        else {
          // TODO
          var queryString;
          if (folderRes[0]) {
            queryString = "SELECT * FROM " + bookmarx_table + " b where b.folder_id=" +folderRes[0].id;
            db.query(queryString, function(err, res) {
              if (err){
                throw err;
              }
              if (res) {
                response.render('bookmarx/list.ejs', {bookmarxList: res,
                                                      folderList: folderRes});
              }
            });
          }
          else {
            response.render('bookmarx/list.ejs', {bookmarxList: [],
                                                  folderList: folderRes});
          }

        }
      }
    });
};

/**
 * Renders page to delete a bookmarx
 */
var deleteBookmarx = module.exports.deleteBookmarx =  function(req, res) {
  var bookmarx_id = req.params.bookmarx_id;
  res.render('bookmarx/delete.ejs', {bookmarx_id: bookmarx_id});
};

/*
 * Deletes a bookmark
 */
var deleteBookmarxAuth = module.exports.deleteBookmarxAuth =  function(req, response) {
  var bookmarx_id = req.body.bookmarx_id;

  var deleteKeywordsQuery = "DELETE FROM " + keywords_table + " WHERE id="+bookmarx_id;
  db.query(deleteKeywordsQuery, function(err, res) {
    if (err){
      response.redirect('/bookmarx/delete');
      throw err;
    }
    if (res) {
      var queryString = "DELETE FROM " + bookmarx_table + " WHERE id="+bookmarx_id;
      db.query(queryString, function(err, res) {
        if (err){
          response.redirect('/bookmarx/delete');
          throw err;
        }
        if (res) {
          response.redirect('/bookmarx');
        }
      });
    }
  });

};

/*
 * Updates a bookmark
 *
 */
var edit = module.exports.edit =  function(req, res) {
  var bookmarx_title = db.escape(req.body.title);
  var bookmarx_url = db.escape(req.body.url);
  var bookmarx_desc = db.escape(req.body.desc);
  var bookmarx_keywords = db.escape(req.body.keywords);
  var bookmarx_folder_id = db.escape(req.body.folder);
  var account_id = db.escape(req.body.account_id);

  if (bookmarx_title &&
      bookmarx_url   &&
      bookmarx_desc  &&
      bookmarx_keywords &&
      bookmarx_folder_id) {
        var querystring = "UPDATE " + bookmarx_table + "SET ";
        querystring += "folder_id="+bookmarx_folder_id+ ", name="+ bookmarx_title +", description=" +bookmarx_desc + ", url=" + bookmarx_url;
        querystring += " WHERE bookmarx_id="+bookmarx_id+" AND account_id="+account_id;
        db.query(queryString, function(err, res) {
          if (err) throw err;
          if (res) {
            // TODO update keywords if changed?

            res.redirect('/bookmarx');
          }
        });
  }
  else {
    res.render('bookmarx/edit.ejs');
  }
};

var foldersettings = module.exports.foldersettings =  function(req, res) {
  res.render('bookmarx/foldersettings.ejs');
};

var updatefolder = module.exports.updatefolder = function(req, res) {
  //TODO Make query to update the folder name
  var folder_id = req.params.folder_id;
  var querystring = "SELECT * from " + bookmarx_table + " LEFT OUTER JOIN " + folder_table + " ON "+bookmarx_table+".folder_id = " + folder_table+".folder_id ORDER BY "+ bookmarx_table +"timestamp";
  if (folder_id) {
  }
  else {
    var querystring = "SELECT * from " + bookmarx_table + " LEFT OUTER JOIN " + folder_table + " ON "+bookmarx_table+".folder_id = " + folder_table+".folder_id ORDER BY "+ bookmarx_table +"timestamp";
    return res.render('bookmarx/list.ejs');
  }
}

var addfolder = module.exports.addfolder =  function(req, res) {
  var folder_title = db.escape(req.body.folder_title);
  var account_id = db.escape(req.body.account_id);

  res.render('bookmarx/addfolder.ejs');
};

var addfolderauth = module.exports.addfolderauth =  function(req, response) {
  var folder_title = db.escape(req.body.folder_title);
  var account_id = req.body.account_id;
  var querystring = "INSERT INTO " + folder_table + " (account_id, name) VALUES(" + account_id +"," + "\""+ folder_title + "\"" + ")";
  db.query(querystring, function(err, res2) {
    if(err) {
      throw err;
      response.redirect('/bookmarx/addfolder');
    }
    response.redirect('/bookmarx');
  });

};

var settings = module.exports.settings =  function(req, res) {
  res.render('bookmarx/settings.ejs');
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
