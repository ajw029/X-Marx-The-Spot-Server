
var HomeContainer = React.createClass({
  getInitialState: function () {
    mixpanel.track("Home Page");
    var folderList = [];
    var myBookmarks = [];
    var curFolder = '';
    var curFolderName = '';
    return {
      curFolder: curFolder,
      folderList: folderList,
      myBookmarks: [],
      curFolderName: curFolderName,
      showErrOverlay: false
      };
  },
  componentDidMount: function() {
    // Gets all the folders
    this.serverRequest = $.get("/api/getfolders", function (result,status,xhr) {

      this.setState({
        folderList: result
      });
      if (!this.state.curFolder && result && result.length > 0) {
        mixpanel.identify(result[0].account_id.toString());
        mixpanel.register({'AccountID': result[0].account_id.toString()});
        mixpanel.people.set({
          '$name': result[0].account_id.toString(),
          'Date': new Date()
        });
        this.setState({
          curFolder: result[0].id,
          curFolderName: result[0].name
        });
      }
    }.bind(this));

    this.getBookmarks();
   },
   getBookmarks: function(folderID) {
     var body = {};
     if (folderID) {
       body.folder_id = folderID;
       this.setState({
         curFolder: folderID
       });
     }
     // Gets all the bookmarks
     this.serverRequest = $.get("/api/getbookmarks", body, function (result) {
       this.setState({
         myBookmarks: result
       });

     }.bind(this));
   },
   favBookmark: function(b_id) {
     var myBookmarksList =this.state.myBookmarks;
     for (var i = 0; i < myBookmarksList.length; i++) {
       var myBookmark = myBookmarksList[i];
       if (myBookmark.id == b_id) {
         myBookmarksList[i].favorite = (!myBookmark.favorite);
         break;
       }
     }
     this.setState({myBookmarks: myBookmarksList});
   },
   deleteBookmark: function(b_id) {
     var myBookmarksList =this.state.myBookmarks;
     var i = 0;
     for (; i < myBookmarksList.length; i++) {
       var myBookmark = myBookmarksList[i];
       if (myBookmark.id == b_id) {
         myBookmarksList[i].favorite = (!myBookmark.favorite);
         break;
       }
     }
     myBookmarksList.splice(i, 1);
     this.setState({myBookmarks: myBookmarksList});
   },
   favBookmarkErr: function() {
     this.setState({showErrOverlay: true, overlayMsg: 'Could Not Favorite Bookmark Try Again Later'});
     setTimeout(function(){
       this.setState({showErrOverlay: false});
     }.bind(this), 3000);
   },
   deleteBookmarkErr: function() {
     this.setState({showErrOverlay: true, overlayMsg: 'Could Not Delete Bookmark Try Again Later'});
     setTimeout(function(){
       this.setState({showErrOverlay: false});
     }.bind(this), 3000);
   },
   sortData: function(sortOption) {
     var myBookmarks = this.state.myBookmarks;
     if (sortOption == 'asc') {
       myBookmarks.sort(function(a,b){
         var compA = a.name.toLowerCase();
         var compB = b.name.toLowerCase();
         if(compA < compB) return -1;
         if(compA > compB) return 1;
         return 0;
       });
     }
     else if (sortOption == 'desc') {
       myBookmarks.sort(function(a,b){
         var compA = a.name.toLowerCase();
         var compB = b.name.toLowerCase();
         if(compA < compB) return 1;
         if(compA > compB) return -1;
         return 0;
       });
     }
     this.setState({myBookmarks: myBookmarks});
     this.forceUpdate();
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
              curFolderName={this.state.curFolderName}
              folderList={this.state.folderList}
              getBookmarks={this.getBookmarks}
              />
          </section>
          <section className="right-container">
            <BookmarxContainerComponent
              myBookmarks={this.state.myBookmarks}
              favBookmark={this.favBookmark}
              deleteBookmark={this.deleteBookmark}
              favBookmarkErr={this.favBookmarkErr}
              deleteBookmarkErr={this.deleteBookmarkErr}
              sortData={this.sortData}
              showSort={true}
              />
          </section>
          <ToggleDisplay show={this.state.showErrOverlay}>
            <ConfirmationOverlay
              errMsg={this.state.overlayMsg}
            />
          </ToggleDisplay>
        </div>
        <AddBookmarkContainer/>
        <MobileNav/>
      </div>
    );
  }
});
module.exports = HomeContainer;
