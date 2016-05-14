var config = require('./my_configs');
var db = require('./db');
var bookmarx = require('./bookmarx');
var users = require('./users');

db.init();

var express = require('express');
fs = require('fs');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var compression = require('compression');
var minify = require('express-minify');
var session = require('express-session');
var minifyHTML = require('express-minify-html');
var mySession = session({
  secret: config.SESSION_KEY,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
});


var app = express();
// Set up session
app.use(mySession);

/*  Not overwriting default views directory of 'views' */
app.set('view engine', 'ejs');
app.set('view cache', true);
app.set('x-powered-by', false);
app.use(compression());
app.use(minify({cache: './cache'}));
app.use(minifyHTML({
    override:      true,
    htmlMinifier: {
        removeComments:            true,
        collapseWhitespace:        true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes:     true,
        removeEmptyAttributes:     true,
        minifyJS:                  true
    }
}));

//app.use(minify());

app.use(express.static('./public', { maxAge: 86400000 })); // One day caching
app.use(bodyParser.urlencoded({ extended: true }));

// Set up logging files (accessLog for suspicious requests, errorLog for errors)
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
var errorLogStream = fs.createWriteStream(__dirname + '/error.log', {falgs: 'a'});

// Set up logging to detect only "suspicious" requests (any requests we haven't defined)
app.use(morgan('{"remote_addr": ":remote-addr", "remote_user": ":remote-user", "date": ":date[clf]", "method": ":method", "url": ":url", "http_version": ":http-version", "status": ":status", "result_length": ":res[content-length]", "referrer": ":referrer", "user_agent": ":user-agent", "response_time": ":response-time"}', 
{ skip: function(req, res) { return (req.method === 'GET' || req.method === 'POST'); },
	stream: accessLogStream }
));

// Set up error logging
app.use(morgan('{"remote_addr": ":remote-addr", "remote_user": ":remote-user", "date": ":date[clf]", "method": ":method", "url": ":url", "http_version": ":http-version", "status": ":status", "result_length": ":res[content-length]", "referrer": ":referrer", "user_agent": ":user-agent", "response_time": ":response-time"}',
  { skip: function(req,res) { return res.statusCode < 400; },
  stream: errorLogStream } 
));

// Login And Signup
app.get('/', users.login);

app.get('/signup', users.signup);
app.post('/signup', users.signupAuth);
app.get('/login', users.login);
app.post('/login', users.loginAuth);
app.get('/logout', users.logout);

// Robots.txt file
app.get('/robots.txt', bookmarx.robots);

/*  This must go between the users routes and the books routes */
app.use(users.auth);

// Bookmarx Routes
app.get(['/bookmarx',
         '/index.html',
         '/bookmarx/:folder_id(\\d+)'], bookmarx.list);

app.get('/bookmarx/settings', bookmarx.settings);

app.get('/bookmarx/add', bookmarx.add);
app.post('/bookmarx/add', bookmarx.addBookmarxAuth);

app.post('/bookmarx/staraction/:page(\\d)', bookmarx.staraction);

app.get(['/bookmarx/edit/:bookmarx_id(\\d+)/:folder_id(\\d+)/:page(\\d+)', '/bookmarx/edit'], bookmarx.editBookmarx);
app.post('/bookmarx/edit', bookmarx.editBookmarxAuth);

app.get('/bookmarx/addfolder', bookmarx.addfolder);
app.post('/bookmarx/addfolder', bookmarx.addfolderauth);

app.get('/bookmarx/delete/:bookmarx_id(\\d+)/:folder_id(\\d+)/:page(\\d+)', bookmarx.deleteBookmarxAuth);

//Folder Settings
app.get('/foldersetting/:folder_id(\\d+)', bookmarx.foldersettings);
app.post('/bookmarx/updatefolder/:folder_id(\\d+)', bookmarx.updatefolder);
app.post('/bookmarx/deletefolder',bookmarx.deletefolder);

app.post('/bookmarx/updatepassword',users.updatepassword);

//open the views
app.get('/bookmarx/favorites/',bookmarx.openFavoritesView);
app.get('/bookmarx/mostvisited',bookmarx.mostvisited);

app.get(['/bookmarx/click/:bookmarx_id(\\d+)',
         '/bookmarx/click/:folder_id(\\d+)/:bookmarx_id(\\d+)'],bookmarx.clickCount);

app.get('/bookmarx/search',bookmarx.search);

// export & import
app.post('/bookmarx/import',bookmarx.importBookmarks);
app.get('/bookmarx/export',bookmarx.exportBookmarks);


app.use(function (req, res, next) {
    res.redirect('/');
});


app.listen(config.PORT, function () {
  console.log('Example app listening on port ' + config.PORT + '!');
});
