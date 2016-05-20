var React = require('react');
var MobileNav = React.createFactory(require('../components/MobileNavComponent.react'));
var NavBar = React.createFactory(require('../components/Nav.react'));
var SideBar = React.createFactory(require('../components/SideBarComponent.react'));
var AddBookmarkContainer = React.createFactory(require('../components/AddBookMarkFab.react'));
var FolderContainerComponent = React.createFactory(require('../components/FolderContainer.react'));
var BookmarxContainerComponent = React.createFactory(require('../components/BookmarxContainerComponent.react'));

var MobileFolderSwitcherContainer = React.createFactory(require('../components/MobileFolderComponent.react'));

var HomeContainer = React.createClass({
  getInitialState: function () {
    return {
      curFolder: '',
      folderList: [],
      myBookmarks: []
      };
  },
  componentDidMount: function() {
    // Gets all the folders
    this.serverRequest = $.get("/api/getfolders", function (result) {
      this.setState({
        folderList: result
      });
      if (!this.state.curFolder.trim() && result && result.length > 0) {
        this.setState({
          curFolder: result[0].id
        });
      }
    }.bind(this));
    this.getBookmarks();
   },
   getBookmarks(folderID) {
     var body = {};
     if (folderID) {
       body.folder_id = folderID;
       this.setState({
         curFolder: folderID
       });
     }
     // Gets all the bookmarks
     this.serverRequest = $.get("/api/getbookmarks", body, function (result) {
       console.log(result)
       this.setState({
         myBookmarks: result
       });
     }.bind(this));
   },
   render: function() {
     return (
      <div>
        <NavBar/>
        <div className="container">
          <SideBar/>
          <section className="slide-container">
            <FolderContainerComponent
              curFolder={this.state.curFolder}
              folderList={this.state.folderList}
              getBookmarks={this.getBookmarks}
            />
            <MobileFolderSwitcherContainer
              curFolder={this.state.curFolder}
              folderList={this.state.folderList}
              getBookmarks={this.getBookmarks}
              />
          </section>
          <section className="right-container">
            <BookmarxContainerComponent
              myBookmarks={this.state.myBookmarks}/>
          </section>
        </div>
        <AddBookmarkContainer/>
        <MobileNav/>
      </div>
    );
  }
});
module.exports = HomeContainer;
