var config = require('./my_configs');
var db = require('./db');
var bookmarx = require('./bookmarx');
var users = require('./users');

db.init();

var express = require('express');
var bodyParser = require('body-parser');

var session = require('express-session');
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
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Login And Signup
app.get('/', users.login);

app.get('/signup', users.signup);
app.post('/signup', users.signupAuth);
app.get('/login', users.login);
app.post('/login', users.loginAuth);
app.get('/logout', users.logout);

/*  This must go between the users routes and the books routes */
app.use(users.auth);

// Bookmarx Routes
app.get(['/bookmarx',
         '/index.html',
         '/bookmarx/:folder_id(\\d+)'], bookmarx.list);

app.get('/bookmarx/settings', bookmarx.settings);

app.get('/bookmarx/add', bookmarx.add);
app.post('/bookmarx/add', bookmarx.addBookmarxAuth);

app.post('/bookmarx/staraction', bookmarx.staraction);

app.get(['/bookmarx/edit/:bookmarx_id(\\d+)', '/bookmarx/edit'], bookmarx.editBookmarx);
app.post('/bookmarx/edit', bookmarx.editBookmarxAuth);

app.get('/bookmarx/addfolder', bookmarx.addfolder);
app.post('/bookmarx/addfolder', bookmarx.addfolderauth);

app.get('/bookmarx/delete/:bookmarx_id(\\d+)', bookmarx.deleteBookmarxAuth);

//Folder Settings
app.get('/foldersetting/:folder_id(\\d+)', bookmarx.foldersettings);
app.post('/bookmarx/updatefolder/:folder_id(\\d+)', bookmarx.updatefolder);
app.post('/bookmarx/deletefolder',bookmarx.deletefolder);

app.post('/bookmarx/updatepassword',users.updatepassword);

app.get('/bookmarx/favorites',bookmarx.openFavoritesView);

app.get('/bookmarx/mostvisited',bookmarx.mostvisited)


app.listen(config.PORT, function () {
  console.log('Example app listening on port ' + config.PORT + '!');
});
