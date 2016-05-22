// React
React = require('react');
var render = require('react-dom');

Router = require('react-router').Router;
Route = require('react-router').Route;
Link = require('react-router').Link;

browserHistory = require('react-router').browserHistory;
ToggleDisplay = require('react-toggle-display');

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

var SearchView = require('./app/SearchComponents.react');

// Setings
var Settings = require('./app/SettingsPageComponent.react');

// Reused Components
BackButton = React.createFactory(require('./components/FormBackButtonComponent.react'));
AddBookmarkComponent = React.createFactory(require('./components/AddBookmarkComponent.react'));
MobileNav = React.createFactory(require('./components/MobileNavComponent.react'));
AddFolderComponent = React.createFactory(require('./components/AddFolderComponent.react'));
NavBar = React.createFactory(require('./components/Nav.react'));
SideBar = React.createFactory(require('./components/SideBarComponent.react'));
AddBookmarkContainer = React.createFactory(require('./components/AddBookMarkFab.react'));
FolderContainerComponent = React.createFactory(require('./components/FolderContainer.react'));
BookmarxContainerComponent = React.createFactory(require('./components/BookmarxContainerComponent.react'));
MobileFolderSwitcherContainer = React.createFactory(require('./components/MobileFolderComponent.react'));

route = (<Router history={browserHistory}>
  <Route path="/app/home" name="home" component={HomeContainer}></Route>
  <Route path="/app/myfavlinks" component={MyFavComponent}></Route>
  <Route path="/app/myrecent" name="recent" component={MostRecentComponent}></Route>

  <Route path="/app/addnewbookmark" component={AddBookmarkPageComponent}></Route>
  <Route path="/app/search/:searchorder/:searchinput" component={SearchView}></Route>
  <Route path="/app/addnewfolder" component={AddFolderPage}></Route>
  <Route path="/app/editmyfolder/:folder_id" component={EditFolder}></Route>

  <Route path="/app/gotosettings" component={Settings}></Route>
  <Route path="/app/editmybookmark/:bookmarx_id" component={EditBookmarkPageComponent}></Route>
</Router>);

render.render((
  route
), document.getElementById('myapp'));
