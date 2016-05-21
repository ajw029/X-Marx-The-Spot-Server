
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
   render: function() {
     return (
      <div>
        <NavBar/>
        <div className="container">
          <SideBar/>
          <section className="right-container center-container">
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
module.exports = MyFavComponent;
