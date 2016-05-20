var React = require('react');

var MobileNav = React.createFactory(require('../components/MobileNavComponent.react'));
var NavBar = React.createFactory(require('../components/Nav.react'));
var SideBar = React.createFactory(require('../components/SideBarComponent.react'));
var AddBookmarkContainer = React.createFactory(require('../components/AddBookMarkFab.react'));
var BookmarxContainerComponent = React.createFactory(require('../components/BookmarxContainerComponent.react'));

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
