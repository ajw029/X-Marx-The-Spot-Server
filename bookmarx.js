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
  var queryFolderListString = "SELECT * FROM " + folder_table+" WHERE account_id="+account_id + " AND deleted=0";

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
  if (!folder_id ) {
    folder_id=req.query.folder_id
  }
  var account_id = req.body.account_id;
  var selectedFolder = {selectedFolder: folder_id};

  var queryFolderListString = "SELECT * FROM " + folder_table+" WHERE account_id="+account_id +" AND deleted=0";

  db.query(queryFolderListString, function(err, folderRes) {
      if (err){
        throw err;
      }

    var ordering = '';
    if (req.query.ordering && (req.query.ordering === 'asc' || req.query.ordering === 'desc')) {
      ordering = ' ORDER BY name ' + req.query.ordering;
    }
      if (folderRes) {
        if (folder_id) {
          // TODO
          var queryString = "SELECT * FROM " + bookmarx_table + " WHERE folder_id=" + folder_id+" AND deleted=0";


          db.query(queryString + ordering, function(err, res) {
            if (err){
              throw err;
            }
            if (res) {

              response.render('bookmarx/list.ejs', {bookmarxList: res,
                                                    folderList: folderRes,
                                                    selectedFolder: selectedFolder,
                                                    search: req.query.search || '',
                                                    ordering: req.query.ordering || ''});
            }
          });
        }
        else {
          // TODO
          var queryString;
          if (folderRes[0]) {

            queryString = "SELECT * FROM " + bookmarx_table + " b where b.folder_id=" +folderRes[0].id+" AND deleted=0";

            if (req.query.search && req.query.search.length > 0) {
              req.query.search = db.escape(req.query.search);
              req.query.search = req.query.search.slice(1, req.query.search.length - 1);
              var pattern = 'LIKE \'%' + req.query.search + '%\'';
              queryString += ' AND (name ' + pattern +' OR url '+ pattern +' OR description '+ pattern +')';

            }
            selectedFolder = {selectedFolder: folderRes[0].id};
            db.query(queryString + ordering, function(err, res) {
              if (err){
                throw err;
              }
              if (res) {
                response.render('bookmarx/list.ejs', {bookmarxList: res,
                                                      folderList: folderRes,
                                                      selectedFolder: selectedFolder,
                                                      search: req.query.search || '',
                                                      ordering: req.query.ordering || ''});
              }
            });
          }
          else {
            response.render('bookmarx/list.ejs', {bookmarxList: [],
                                                  folderList: folderRes,
                                                  selectedFolder: selectedFolder,
                                                  search: req.query.search || '',
                                                  ordering: req.query.ordering || ''});
          }

        }
      }
    });
};

/**
 * Renders page to delete a bookmarx
 */
var deleteBookmarxAuth = module.exports.deleteBookmarxAuth =  function(req, response) {
  var bookmarx_id = db.escape(req.params.bookmarx_id);
  var account_id = req.body.account_id;
  //Not deleted but hidden
  var deleteBookMarksQuery= "update " +bookmarx_table+ " set deleted=1 where account_id="+account_id+" AND id="+bookmarx_id;
  db.query(deleteBookMarksQuery, function(err, res) {
    if (err){
      response.redirect('/bookmarx/delete');
      throw err;
    }
    if (res) {
      response.redirect('/bookmarx');
    }
  });

};

/*
 * Updates a bookmark
 *
 */
var editBookmarx = module.exports.editBookmarx =  function(req, response) {

  var account_id = db.escape(req.body.account_id);
  var bookmarx_id = db.escape(req.params.bookmarx_id);
  var queryString = "SELECT * FROM " + bookmarx_table + " WHERE account_id="+account_id + " AND id="+bookmarx_id;
  var folderQuery = "SELECT * FROM " + folder_table + " WHERE account_id="+account_id + " AND deleted=0";

  db.query(queryString, function(err, res) {
    if (err) {
      response.redirect('/bookmarx');
      throw err;
    }
    else {
      db.query(folderQuery, function(err, folderList) {
        if (err) {
          response.redirect('/bookmarx');
          throw err;
        }
        else {
          response.render('bookmarx/edit.ejs', {bookmarx: res[0],
                                                foldersList: folderList});
          }
        });
      }
  });
};

var editBookmarxAuth = module.exports.editBookmarxAuth =  function(req, response) {
  var bookmarx_title = db.escape(req.body.title);
  var bookmarx_url = db.escape(req.body.url);
  var bookmarx_desc = db.escape(req.body.desc);
  var bookmarx_keywords = db.escape(req.body.keywords);
  var bookmarx_folder_id = db.escape(req.body.folder);
  var bookmarx_id = db.escape(req.body.bookmarx_id);

  var account_id = db.escape(req.body.account_id);

  if (bookmarx_title &&
      bookmarx_url   &&
      bookmarx_desc  &&
      bookmarx_keywords &&
      bookmarx_folder_id) {
        var querystring = "UPDATE " + bookmarx_table + " SET ";
        querystring += "folder_id="+bookmarx_folder_id+ ", name="+ bookmarx_title +", description=" +bookmarx_desc + ", url=" + bookmarx_url;
        querystring += " WHERE id="+bookmarx_id+" AND account_id="+account_id ;
        db.query(querystring, function(err, res) {
          if (err) {
            response.redirect('/bookmarx');
            throw err;
          }
          if (res) {
            // TODO update keywords if changed?

            response.redirect('/bookmarx');
          }
        });
  }
  else {
    response.render('bookmarx/edit.ejs');
  }
};

/*
 *
 */

var foldersettings = module.exports.foldersettings =  function(req, response) {
  var folder_id= db.escape(req.params.folder_id);
  var account_id = db.escape(req.body.account_id);

  var queryString = "SELECT * from " +folder_table + " where id="+folder_id + " and account_id="+account_id;
  db.query(queryString, function(err, res) {
    if (err){
      response.redirect('/bookmarx');
      throw err;
    }
    if (res) {
      response.render('bookmarx/foldersettings.ejs', {folder: res[0]});
    }
  });

};

var deletefolder=module.exports.deletefolder=function(req,response){
  var folder_id= db.escape(req.body.folder_id);
  var account_id = db.escape(req.body.account_id);

  var deleteFolderQuery="UPDATE " + folder_table +" set deleted=1 where id="+folder_id+" AND account_id="+account_id + " and name<>'Default'";

  db.query(deleteFolderQuery,function(err,res){
    if(err){
      throw err;
      response.redirect('/bookmarx');
    }if(res){

      var deleteChildBookmarksQuery="update "+bookmarx_table+" set deleted=1 where id="+folder_id+" AND account_id="+account_id;

      db.query(deleteChildBookmarksQuery,function(err,res2){
        if(err){
          throw err;
          response.redirect('/bookmarx/deletefolder');
        }
        if(res2){
           response.redirect('/bookmarx');
        }
      });
    }

  });
};

var updatefolder = module.exports.updatefolder = function(req, res) {
  //TODO Make query to update the folder name

  var folder_id  = req.params.folder_id;
  var account_id = req.body.account_id;
  if (isNaN(folder_id)|| isNaN(account_id)) {
    res.redirect("/bookmarx");
  }
  if (!req.body.newname.trim()) {
    res.redirect("/foldersetting/"+folder_id);
  }
  else {
    folder_id = db.escape(folder_id);
    account_id = db.escape(account_id);
    var newName = db.escape(req.body.newname);

    var updateFolderQuery="update "+folder_table+" set name="+ newName +" where id="+folder_id+" AND account_id="+account_id + " AND name<>'Default'";

    db.query(updateFolderQuery,function(err,res1){
      if(err){
        throw err;
        res.redirect("/foldersettings");
      }if(res1){
        res.redirect("/bookmarx");
      }
    });
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
  if (!folder_title.trim()) {
    response.redirect('/bookmarx/addfolder');
  }

  var querystring = "INSERT INTO " + folder_table + " (account_id, name) VALUES(" + account_id +"," + folder_title + ")";
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

var staraction = module.exports.staraction =  function(req, response) {
  var bookmarx_id = db.escape(req.body.bookmarx_id);
  var account_id = req.body.account_id;
  
  var select_queryString = "SELECT * FROM " + bookmarx_table + " WHERE id="+bookmarx_id + " AND account_id="+account_id;
  db.query(select_queryString, function(err, res) {
    if (err) {
      throw err;
      response.redirect('/bookmarx');
    }
    if (res) {
      var folder_id=res[0].folder_id;
      var querystring = "UPDATE " + bookmarx_table + " SET ";
      querystring += "favorite="+ (!res[0].favorite);
      querystring += " WHERE id="+bookmarx_id + " AND account_id="+account_id;
      db.query(querystring, function(err, res) {
        if (err) {
          throw err;
          response.redirect('/bookmarx');
        }
        if (res) {
          
          response.redirect('/bookmarx/'+folder_id);
        }
      });
    }
  });
};


var openFavoritesView=module.exports.openFavoritesView=function(req,response){
    
    var account_id=req.body.account_id;

     var queryString = "SELECT * FROM " + bookmarx_table + " WHERE favorite=1 AND account_id="+account_id ;

    var ordering = '';
    if (req.query.ordering && (req.query.ordering === 'asc' || req.query.ordering === 'desc')) {
      ordering = ' ORDER BY name ' + req.query.ordering;
    }

          db.query(queryString + ordering, function(err, res) {
            if (err){
              throw err;
            }
            if (res) {

              response.render('bookmarx/liststared.ejs', {bookmarxList: res,
                                                    search: req.query.search || '',
                                                    ordering: req.query.ordering || ''});
            }
          });
};

var mostvisited=module.exports.mostvisited=function(req,response){
  var account_id=req.body.account_id;
  var topN=5;
  var queryString="SELECT * FROM "+bookmarx_table+" WHERE account_id="+account_id+" ORDER BY visit_count DESC  LIMIT "+ topN; 

  db.query(queryString,function(err,res){
    if(err){
      throw err;
      response.redirect('/bookmarx');
    }
    if(res){
      response.render("bookmarx/mostvisited", {bookmarxList: res,
                                            search: req.query.search || '',
                                            ordering: req.query.ordering || ''});

    }
  });

};
