
var MyFavComponent = React.createClass({
  getInitialState: function () {
    mixpanel.track("Recent Page");
    return {
      curFolder: '',
      folderList: [],
      myBookmarks: [],
      showErrOverlay: false
      };
  },
  componentDidMount: function() {
    // Gets all the folders
    this.serverRequest = $.get("/api/mostvisited", function (result) {
       this.setState({
         myBookmarks: result.bookmarxList
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
         return (compA > compB);
       });
     }
     else if (sortOption == 'desc') {
       myBookmarks.sort(function(a,b){
         var compA = a.name.toLowerCase();
         var compB = b.name.toLowerCase();
         return (compA < compB);
       });
     }
     this.setState({myBookmarks: myBookmarks})
   },
   render: function() {
     return (
      <div>
        <NavBar/>
        <div className="container">
          <SideBar/>
          <section className="right-container center-container">
            <BookmarxContainerComponent
              myBookmarks={this.state.myBookmarks}
              favBookmark={this.favBookmark}
              deleteBookmark={this.deleteBookmark}
              favBookmarkErr={this.favBookmarkErr}
              deleteBookmarkErr={this.deleteBookmarkErr}
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
module.exports = MyFavComponent;
