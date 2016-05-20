
var SearchResultsComponent = React.createClass({
  getInitialState: function () {
    return {
      myBookmarks: []
      };
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
        <MobileNav/>
      </div>
    );
  }
});
module.exports = SearchResultsComponent;
