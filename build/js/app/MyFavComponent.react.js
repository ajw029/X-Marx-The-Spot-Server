
var MyFavComponent = React.createClass({
  getInitialState: function () {
    return {
      curFolder: '',
      folderList: [],
      myBookmarks: []
      };
  },
  componentDidMount: function() {
    // Gets all the folders
    this.serverRequest = $.get("/api/favorites", function (result) {
       this.setState({
         myBookmarks: result.bookmarxList
       });
    }.bind(this));
   },
   favBookmark: function(b_id) {
     var myBookmarksList =this.state.myBookmarks;
     var fav = true;
     var i = 0;
     for (; i < myBookmarksList.length; i++) {
       var myBookmark = myBookmarksList[i];
       if (myBookmark.id == b_id) {
         myBookmarksList[i].favorite = (!myBookmark.favorite);
         fav = myBookmarksList[i].favorite;
         break;
       }
     }
     if (!fav) {
       myBookmarksList.splice(i, 1);
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
              />
          </section>
        </div>
        <AddBookmarkContainer/>
        <MobileNav/>
      </div>
    );
  }
});
module.exports = MyFavComponent;
