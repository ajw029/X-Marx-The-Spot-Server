var React = require('react');
var render = require('react-dom');

Router = require('react-router').Router;
Route = require('react-router').Route;
Link = require('react-router').Link;

browserHistory = require('react-router').browserHistory;

// List Views
var HomeContainer = require('./app/Home.react');
var MostRecentComponent = require('./app/MostRecentComponent.react');
var MyFavComponent = require('./app/MyFavComponent.react');
// Bookmarks
var AddBookmarkPageComponent = require('./app/AddBookmarkPageComponent.react');
var EditBookmarkPageComponent = require('./app/EditBookmarkPageComponent.react');
// Folder
var AddFolderPage = require('./app/AddFolderPageComponent.react');
var EditFolder = require('./app/EditFolderPageComponent.react');

// Setings
var Settings = require('./app/SettingsPageComponent.react');

route = (<Router history={browserHistory}>
  <Route path="/home" component={HomeContainer}></Route>
  <Route path="/myfavlinks" component={MyFavComponent}></Route>
  <Route path="/myrecent" component={MostRecentComponent}></Route>

  <Route path="/addnewbookmark" component={AddBookmarkPageComponent}></Route>

  <Route path="/addnewfolder" component={AddFolderPage}></Route>
  <Route path="/editmyfolder" component={EditFolder}></Route>

  <Route path="/gotosettings" component={Settings}></Route>
  <Route path="/editmybookmark" path="/:bookmarx_id" component={EditBookmarkPageComponent}></Route>
  <Route path="/" component={HomeContainer}></Route>
</Router>);

render.render((
  route
), document.getElementById('myapp'));
