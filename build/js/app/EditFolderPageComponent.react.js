var React = require('react');

var EditFolderComponent = React.createFactory(require('../components/EditFolderComponent.react'));
var MobileNav = React.createFactory(require('../components/MobileNavComponent.react'));
var NavBar = React.createFactory(require('../components/Nav.react'));

var EditFolderPage = React.createClass({
  getInitialState: function () {
    return {
      folderList: []
      };
  },
  componentDidMount: function() {
    // Gets all the folders
    this.serverRequest = $.get("/api/getfolders", function (result) {
      this.setState({
        folderList: result
      });
    }.bind(this));
  },
  render: function() {
    return (
      <div>
        <NavBar/>
        <div className="container">
          <EditFolderComponent
            folderList={this.state.folderList}
          />
        </div>
        <MobileNav/>
      </div>
    )
  }
});
module.exports = EditFolderPage;
