var React = require('react');
var AddFolderComponent = React.createFactory(require('../components/AddFolderComponent.react'));
var MobileNav = React.createFactory(require('../components/MobileNavComponent.react'));
var NavBar = React.createFactory(require('../components/Nav.react'));
var AddFolderPage = React.createClass({
  render: function() {
    return (
      <div>
        <NavBar/>
        <div className="container">
          <AddFolderComponent/>
        </div>
        <MobileNav/>
      </div>
    )
  }
});
module.exports = AddFolderPage;
