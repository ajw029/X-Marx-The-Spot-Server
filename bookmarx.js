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

  var queryFolderListString = db.squel
      .select()
      .from(folder_table)
      .where('account_id=' + db.escape(account_id))
      .where('deleted=0')
      .toString();

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

    var queryString = db.squel
        .insert()
        .into(bookmarx_table)
        .setFields({
          'folder_id': bookmarx_folder_id.slice(1, -1),
          'account_id': account_id,
          'name': bookmarx_title.slice(1, -1),
          'url': bookmarx_url.slice(1, -1),
          'description': bookmarx_desc.slice(1, -1),
          'favorite': false
        })
        .toString();

        db.query(queryString, function(err, res) {
          if (err){
            //throw err;
            response.redirect('/bookmarx/add');
          }
          if (res) {
            // Insert Keywords

            var words = bookmarx_keywords.slice(1, -1).split(" ");
            var bookmark_id = res.insertId;

            words.forEach(function insertKeyword(word, index) {
              var queryStringKeyword = db.squel
                .insert()
                .into(keywords_table)
                .setFields({
                  'account_id': account_id,
                  'bookmark_id': bookmark_id,
                  'name': db.escape(word).slice(1, -1),
                })
                .toString();

              db.query(queryStringKeyword, function(err2, res2) {
              if (err2){
                //throw err;
                console.log(err2);
              }
                if (res2) {
                 //Do nothing, insert success
                }
              });
            });

            response.redirect('/bookmarx');
          }
        });
  }
  else {
    response.render('bookmarx/add.ejs');
  }
};

/**
 * Selects all books and then renders the page with the list.ejs template
 */
var list = module.exports.list = function(req, response) {

  var folder_id =  req.params.folder_id;
  if (!folder_id ) {
    folder_id=req.query.folder_id
  }
  var account_id = req.body.account_id;
  var selectedFolder = {selectedFolder: folder_id};

  var queryFolderListString = db.squel
      .select()
      .from(folder_table)
      .where('account_id=' + db.escape(account_id))
      .where('deleted=0')
      .toString();

  db.query(queryFolderListString, function(err, folderRes) {
    if (err) {
      throw err;
    }

    var queryBookmarks = db.squel.select()
        .from(bookmarx_table)
        .where('account_id=' + db.escape(account_id))
        .where('deleted=0');

    queryBookmarks.order('name', true);

    if (folderRes) {
      if (folder_id) {
        queryBookmarks.where('folder_id=' + folder_id);
        selectedFolder = {selectedFolder: folder_id};
      }
      else {
        if (folderRes[0]) {
          queryBookmarks.where('folder_id=' + folderRes[0].id);
          selectedFolder = {selectedFolder: folderRes[0].id};
        }
      }

      db.query(queryBookmarks.toString(), function (err, res) {
        if (err) {
          throw err;
        }
        if (res) {
          response.render('bookmarx/list.ejs', {
            bookmarxList: res,
            folderList: folderRes,
            selectedFolder: selectedFolder,
            search: req.query.search || '',
            ordering: req.query.ordering || ''
          });
        }
      });
    }
  });
};

//search
var search = module.exports.search = function(req,response){

  var account_id = req.body.account_id;
  var keyword = req.query.search;
  var ordering = req.query.ordering;
  var keywordList = [];
  if (keyword)
    keywordList = (keyword.trim()).split(' ');

  // All existing bookmarks
  var queryBookmarks = db.squel.select()
      .field("b.id", "id")
      .field("b.name", "name")
      .field("b.folder_id")
      .field("b.favorite")
      .field("b.url")
      .field("b.deleted")
      .field("b.description")
      .from(bookmarx_table, 'b')
      .join(keywords_table, 'k', 'k.bookmark_id=b.id')
      .where('b.account_id=' + db.escape(account_id))
      .where('deleted=0');

    if (ordering&& (ordering === 'asc' || req.query.ordering === 'desc')) {
      queryBookmarks.order('b.name', req.query.ordering === 'asc');
    }
    var whereExpr = db.squel.expr();
    for (var j = 0; j < keywordList.length; j++) {
      var searchTerm = db.escape(keywordList[j]);
      searchTerm = searchTerm.slice(1, searchTerm.length - 1);
            whereExpr
            .or('b.name LIKE \'%' + searchTerm + '%\'')
            .or('b.url LIKE \'%' + searchTerm + '%\'')
            .or('b.description LIKE \'%' + searchTerm + '%\'')
            .or('k.name LIKE\'%' + searchTerm + '%\'')
    }

    queryBookmarks.where(whereExpr).group('b.id');

    db.query(queryBookmarks.toString(), function (err, res) {
      if (err) {
        throw err;
      }
      if (res) {
        response.render('bookmarx/searchresults.ejs', {
          bookmarxList: res,
          search: req.query.search || '',
          ordering: req.query.ordering || ''
        });
      }
    });

};

/**
 * Renders page to delete a bookmarx
 */
var deleteBookmarxAuth = module.exports.deleteBookmarxAuth = function(req, response) {
  var account_id = req.body.account_id;
  var bookmarx_id = db.escape(req.params.bookmarx_id);
  var page_id = req.params.page;
  var folder_id = req.params.folder_id;

  //Not deleted but hidden
  var deleteBookMarksQuery = db.squel
      .update()
      .table(bookmarx_table)
      .set('deleted=1')
      .where('account_id=' + db.escape(account_id))
      .where('id=' + bookmarx_id)
      .toString();

  db.query(deleteBookMarksQuery, function(err, res) {
    if (err){
      response.redirect('/bookmarx/delete');
      throw err;
    }
    if (res) {
      //Redirect back to current page
      if(page_id == 1)
        response.redirect('/bookmarx/' + folder_id);
      else
        response.redirect(req.headers['referer']);
    }
  });

};

/*
 * Updates a bookmark
 */
var editBookmarx = module.exports.editBookmarx = function(req, response) {

  var account_id = db.escape(req.body.account_id);
  var bookmarx_id = db.escape(req.params.bookmarx_id);

  var folderQuery = db.squel
      .select()
      .from(folder_table)
      .where('account_id=' + account_id)
      .where('deleted=0')
      .toString();

  var queryString = db.squel.select()
      .from(bookmarx_table, "b")
      .field("k.name", "keyword")
      .field("b.id", "id")
      .field("b.name", "name")
      .field("b.folder_id")
      .field("b.favorite")
      .field("b.url")
      .field("b.deleted")
      .field("b.description")
      .field("k.id", "k_id")
      .left_outer_join(keywords_table, "k", "k.bookmark_id=b.id")
      .where("b.account_id="+account_id)
      .where("k.bookmark_id="+bookmarx_id)
      .toString();

  db.query(queryString, function(err, res) {
    if (err) {
      response.redirect('/bookmarx');
      throw err;
    }
    if (res[0]) {
      db.query(folderQuery, function(err, folderList) {
        if (err) {
          response.redirect('/bookmarx');
          throw err;
        }
        else {
          var keywordList = [];
          res.forEach(function getKeyword(entry) {
            var k_id = entry.k_id;
            var word = entry.keyword;
            var keyword = {};
            keyword.k_id = k_id;
            keyword.word = word;
            keywordList.push(keyword)
          });
          //console.log(res)
          response.render('bookmarx/edit.ejs', {keywordList: keywordList,
                                                bookmarx: res[0],
                                                foldersList: folderList,
                                                referer: req.headers['referer']
                                              });
          }
        });
      }
      else {
        response.redirect('/bookmarx');
      }
  });
};

var editBookmarxAuth = module.exports.editBookmarxAuth = function(req, response) {
  var bookmarx_title = db.escape(req.body.title);
  var bookmarx_url = db.escape(req.body.url);
  var bookmarx_desc = db.escape(req.body.desc);
  var bookmarx_keywords = db.escape(req.body.keywords);
  var bookmarx_folder_id = db.escape(req.body.folder);
  var bookmarx_id = db.escape(req.body.bookmarx_id);

  //Get the referer URL so we can return back to page where we clicked edit
  var params = req.headers['referer'].split('/');
  var referer = req.body.referer;

  var account_id = db.escape(req.body.account_id);
  var bookmarx_old_keywords_id = req.body.oldkeyword_ids; // not escaping because messes up array

  if (bookmarx_title &&
      bookmarx_url   &&
      bookmarx_desc  &&
      bookmarx_keywords &&
      bookmarx_folder_id) {
    var querystring = db.squel
        .update()
        .table(bookmarx_table)
        .setFields({
          'folder_id': bookmarx_folder_id.slice(1, -1),
          'name': bookmarx_title.slice(1, -1),
          'description': bookmarx_desc.slice(1, -1),
          'url': bookmarx_url.slice(1, -1)
        })
        .where('id=' + bookmarx_id)
        .where('account_id=' + account_id)
        .toString();

        db.query(querystring, function(err, res) {
          if (err) {
            response.redirect('/bookmarx');
            throw err;
          }
          if (res) {
            //Delete old keywords
            function deleteKeywordOnServer(word_id) {
              var queryStringDelete = db.squel.delete()
                 .from(keywords_table)
                 .where("id = ?", word_id)
                 .toString();
               db.query(queryStringDelete, function(err3, res3) {
                 if (err3){
                   //throw err;
                   console.log(err3);
                 }
                 if (res3) {
                  //Do nothing, insert success
                 }
               });
            };

            if (bookmarx_old_keywords_id instanceof Array) {
              bookmarx_old_keywords_id.forEach(function deleteKeyword(word_id, index) {
                deleteKeywordOnServer(word_id);
              });
            }
            else if (bookmarx_old_keywords_id){
                deleteKeywordOnServer(bookmarx_old_keywords_id);
            }

            // Insert Keywords
            var words = bookmarx_keywords.slice(1, -1).split(" ");
            words.forEach(function insertKeyword(word, index) {
              if (word !='') {
                var queryStringKeyword = db.squel
                  .insert()
                  .into(keywords_table)
                  .setFields({
                    'account_id': account_id,
                    'bookmark_id': bookmarx_id.slice(1, -1),
                    'name': db.escape(word).slice(1, -1),
                  })
                  .toString();

                db.query(queryStringKeyword, function(err2, res2) {
                  if (err2){
                    //throw err;
                    console.log(err2);
                  }
                  if (res2) {
                   //Do nothing, insert success
                  }
                });
              }
            });

            if(params[params.length - 1] == 1)
              response.redirect('/bookmarx/' + params[params.length - 2]);
            else if (params[params.length - 1] == 2)
              response.redirect('/bookmarx/favorites');
            else if (params[params.length - 1] == 3)
              response.redirect('/bookmarx/mostvisited');
            else if (params[params.length - 1] == 4)
              response.redirect(referer);
            else
              response.redirect('/bookmarx');
          }
        });
  }
  else {
    response.render('bookmarx/edit.ejs');
  }
};

/*
 * Folder Settings
 */
var foldersettings = module.exports.foldersettings =  function(req, response) {
  var folder_id= db.escape(req.params.folder_id);
  var account_id = db.escape(req.body.account_id);

  var queryString = db.squel
      .select()
      .from(folder_table)
      .where('id=' + folder_id)
      .where('account_id=' + account_id)
      .toString();

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

  var deleteFolderQuery = db.squel
      .update()
      .table(folder_table)
      .set('deleted=1')
      .where('id=' + folder_id)
      .where('account_id=' + account_id)
      .where('name<>\'Default\'')
      .toString();

  db.query(deleteFolderQuery,function(err,res){
    if(err){
      throw err;
      response.redirect('/bookmarx');
    }if(res){

      var deleteChildBookmarksQuery = db.squel
          .update()
          .table(bookmarx_table)
          .set('deleted=1')
          .where('folder_id=' + folder_id)
          .where('account_id=' + account_id)
          .toString();

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

    var updateFolderQuery = db.squel
        .update()
        .table(folder_table)
        .set('name=' + newName)
        .where('id=' + folder_id)
        .where('account_id=' + account_id)
        .where('name<>\'Default\'')
        .toString();

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

  var querystring = db.squel
      .insert()
      .into(folder_table)
      .setFields({
        'account_id': account_id,
        'name': folder_title.slice(1, -1)
      })
      .toString();

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
  var page = req.params.page;

  var select_queryString = db.squel
      .select()
      .from(bookmarx_table)
      .where('id=' + bookmarx_id)
      .where('account_id=' + account_id)
      .toString();

  db.query(select_queryString, function(err, res) {
    if (err) {
      throw err;
      response.redirect('/bookmarx');
    }
    if (res) {
      var querystring = db.squel
          .update()
          .table(bookmarx_table)
          .set('favorite=' + (!res[0].favorite))
          .where('id=' + bookmarx_id)
          .where('account_id=' + account_id)
          .toString();

      db.query(querystring, function(err, result) {
        if (err) {
          throw err;
          response.redirect('/bookmarx');
        }
        if (result) {
          if(page==1)
            response.redirect('/bookmarx/' + res[0].folder_id);
          else
            response.redirect(req.headers['referer']);
        }
      });
    }
  });
};

var robots = module.exports.robots = function(req, res) {
  res.type('text/plain');
  res.render('bookmarx/robots.ejs');
};

var openFavoritesView = module.exports.openFavoritesView = function(req,response){

  var account_id=req.body.account_id;
  var select_queryString = db.squel
      .select()
      .from(bookmarx_table)
      .where('favorite=1')
      .where('account_id=' + account_id)
      .where('deleted=0')
      .toString();


  var ordering = '';
  if (req.query.ordering && (req.query.ordering === 'asc' || req.query.ordering === 'desc')) {
    ordering = ' ORDER BY name ' + req.query.ordering;
  }

  db.query(select_queryString + ordering, function(err, res) {
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


var mostvisited = module.exports.mostvisited = function(req,response){
   var account_id=req.body.account_id;
   var topN=6;
   var queryString = db.squel
      .select()
      .from(bookmarx_table)
      .where('account_id=' + account_id)
      .where('deleted=0')
      .toString();
   queryString=queryString+" ORDER BY visit_count ASC limit "+ topN;
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

var clickCount=module.exports.clickCount=function(req,response){
    var account_id=req.body.account_id;
    var bookmark_id=db.escape(req.params.bookmarx_id);
    var folder_id=req.params.folder_id;
    var page=req.params.page;
    var queryString = db.squel
        .update()
        .table(bookmarx_table)
        .set('visit_count=visit_count+1')
        .where('id='+bookmark_id)
        .where('account_id=' + account_id)
        .toString();
    db.query(queryString,function(err,res){
      if(err){
        throw err;
        console.log(err);
        response.redirect('/bookmarx');
      }
      if(res){
        var redirectString = db.squel
                            .select()
                            .from(bookmarx_table)
                            .where('id='+bookmark_id)
                            .where('account_id=' + account_id)
                            .where('deleted=0')
                            .toString();

        db.query(redirectString,function(err2,res2){
          if (err2) {
            console.log(err2);
            response.redirect('/bookmarx/'+folder_id);
          }
          if (res2) {
            var redirectURL = res2[0].url;
            if (redirectURL.indexOf('https://') > -1 || redirectURL.indexOf('http://')>-1){

            }
            else {
              redirectURL='http://'+ redirectURL;
            }
            response.redirect(redirectURL);
          }
        });
      }
    });
};

var exportBookmarks = module.exports.exportBookmarks = function(req, response) {
  console.log('>>>>>');

  var backup = {};
  backup['folders'] = new Array();
  var account_id = req.body.account_id;

  var queryFolderListString = db.squel
    .select()
    .from(folder_table)
    .where('account_id=' + db.escape(account_id))
    .where('deleted=0')
    .toString();

  var queryBookmarksListString = db.squel
    .select()
    .from(bookmarx_table)
    .where('account_id=' + db.escape(account_id))
    .where('deleted=0')
    .toString();

  var queryKeywordsListString = db.squel
    .select()
    .from(keywords_table)
    .where('account_id=' + db.escape(account_id))
    .where('deleted=0')
    .toString();

  db.query(queryFolderListString, function(err, resObj) {
    if (err) { throw err; }
    if (resObj) {
      backup['folders'] = resObj;

      db.query(queryBookmarksListString, function(err, resObj) {
        if (err) { throw err; }
        if (resObj) {
          backup['bookmarks'] = resObj;
          db.query(queryBookmarksListString, function(err, resObj) {
            if (err) { throw err; }
            if (resObj) {
              backup['keywords'] = resObj;
              //console.log(backup);

              var today = new Date();
              var fileName = 'backup_'+today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate()+'.json';
              /** sends file to client **/
              fs.writeFile(fileName, JSON.stringify(backup, null, 2) , 'utf-8', function () {
                  response.download(fileName);
              });
            }
          });
        }
      });
    }
  });
};

var importBookmarks = module.exports.importBookmarks = function(req, response){
  //console.log('......<<<<<');
  //console.log(req.body.bookmarksJsonText);

  var importJson = {};

  try {
    importJson = JSON.parse(req.body.bookmarksJsonText);
  }
  catch (e) {
    console.log('not valid json');
    response.render('bookmarx/error.ejs',
      {error: 'Entered invalid Json. Make sure you copy paste the entire file. You can search for a Json validator to fix any mistakes you may have made to the bakup.'});
    return;
  }

  if(!(importJson['folders'] && importJson['bookmarks'] && importJson['keywords'])) {
    response.render('bookmarx/error.ejs',
      {error: 'Backup missing component. Please make sure JSON has folders & bookmarks & keywords'});
    return;
  }

  //console.log(importJson);
  var account_id=req.body.account_id;
  var folderOldNewId = {};


  try {
  for(var i=0; i < importJson['folders'].length; i++) {
    function createFolders(i) {
      if (importJson['folders'][i]['deleted']==1) return;
      var querystring = db.squel
        .select()
        .from(folder_table)
        .where('account_id=' + account_id)
        .where('name=' + db.escape(importJson['folders'][i]['name']))
        .toString();
        //console.log(querystring);

      db.query(querystring, function(err, res) {
        if(err) {console.log(err);}

        if(res && !res[0]) {
          var insertFolderString = db.squel
          .insert()
          .into(folder_table)
          .setFields({
            'account_id': account_id,
            'name': importJson['folders'][i]['name']
          })
          .toString();
          //console.log(insertFolderString);
          db.query(insertFolderString, function(err, res) {
            if(err) {console.log(err);}
            if(res) {
              //console.log("inserted this");
              //console.log(res);

              db.query(querystring, function(err, res) {
                if(err) {console.log(err);}
                if(res && res[0]) {
                  folderOldNewId[importJson['folders'][i]['id']] = res[0].id;
                  if(i == ( importJson['folders'].length - 1) ) {
                    bookmarkInsertStep();
                  }
                }
              });
            }
          });
        }
        else {
          //console.log(res);
          folderOldNewId[importJson['folders'][i]['id']] = res[0].id;
          if(i == ( importJson['folders'].length - 1) ) {
                    bookmarkInsertStep();
          }
        }
      });
    }
    createFolders(i);
  }

  var bookmarksOldNewIdHash = {};

  function bookmarkInsertStep() {
    for(var i=0; i < importJson['bookmarks'].length; i++) {

      function insertBookmark(i) {
        if (importJson['bookmarks'][i]['deleted']==1) return;

        var insertBookmarkString = db.squel
        .insert()
        .into(bookmarx_table)
        .setFields({
         'folder_id': (folderOldNewId[importJson['bookmarks'][i]['folder_id']]),
          'account_id': (account_id),
          'name': (importJson['bookmarks'][i]['name']),
          'url': (importJson['bookmarks'][i]['url']),
          'description': (importJson['bookmarks'][i]['description']),
          'favorite': false,
          'visit_count': 0
        })
        .toString();
        //console.log(insertBookmarkString);

        db.query(insertBookmarkString, function(err, res) {
          if(err) {console.log(err);}
          if(res) {
            //console.log("inserted this");
            //console.log(res.insertId);
            bookmarksOldNewIdHash[importJson['bookmarks'][i]['id']] = res.insertId;
            if(i == ( importJson['bookmarks'].length - 1) ) {
                    keywordInsertStep();
            }
          }
        });
      }
      insertBookmark(i);
    }
  }

  function keywordInsertStep() {
    for(var i=0; i < importJson['keywords'].length; i++) {

      function insertKeywords(i) {

        var insertKeywordsString = db.squel
        .insert()
        .into(keywords_table)
        .setFields({
          'account_id': (account_id),
          'name': (importJson['keywords'][i]['name']),
          'bookmark_id': bookmarksOldNewIdHash[importJson['keywords'][i]['id']]
        })
        .toString();
        //console.log(insertKeywordsString);

        db.query(insertKeywordsString, function(err, res) {
          if(err) {console.log(err);}
          if(res) {
            // END
            if(i == ( importJson['keywords'].length - 1) ) {
              response.redirect('/bookmarx');
            }
          }
        });
      }
      insertKeywords(i);

    }
  }
  }
  catch (e) {
    response.render('bookmarx/error.ejs',
      {error: 'Backup corrupt.'});
    return;
  }

};
