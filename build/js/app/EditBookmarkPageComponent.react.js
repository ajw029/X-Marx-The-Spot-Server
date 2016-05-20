var React = require('react');
var EditBookmarkComponent = React.createFactory(require('../components/EditBookmarkComponent.react'));
var MobileNav = React.createFactory(require('../components/MobileNavComponent.react'));
var NavBar = React.createFactory(require('../components/Nav.react'));

var EditBookmarkPage = React.createClass({
  render: function() {
    return (
      <div>
        <NavBar/>
        <div className="container">
          <EditBookmarkComponent/>
        </div>
        <MobileNav/>
      </div>
    )
  }
});
module.exports = EditBookmarkPage;
