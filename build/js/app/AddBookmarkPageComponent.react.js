var React = require('react');
var AddBookmarkComponent = React.createFactory(require('../components/AddBookmarkComponent.react'));
var MobileNav = React.createFactory(require('../components/MobileNavComponent.react'));
var NavBar = React.createFactory(require('../components/Nav.react'));

var AddBookmarkPage = React.createClass({
  render: function() {
    return (
      <div>
        <NavBar/>
        <div className="container">
          <AddBookmarkComponent/>
        </div>
        <MobileNav/>
      </div>
    )
  }
});
module.exports = AddBookmarkPage;
