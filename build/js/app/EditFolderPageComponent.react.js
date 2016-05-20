var React = require('react');

var EditFolderComponent = React.createFactory(require('../components/EditFolderComponent.react'));
var MobileNav = React.createFactory(require('../components/MobileNavComponent.react'));
var NavBar = React.createFactory(require('../components/Nav.react'));

var EditFolderPage = React.createClass({
  render: function() {
    return (
      <div>
        <NavBar/>
        <div className="container">
          <EditFolderComponent/>
        </div>
        <MobileNav/>
      </div>
    )
  }
});
module.exports = EditFolderPage;
