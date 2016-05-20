var React = require('react');
var EditBookmarkComponent = React.createFactory(require('../components/EditBookmarkComponent.react'));
var MobileNav = React.createFactory(require('../components/MobileNavComponent.react'));
var NavBar = React.createFactory(require('../components/Nav.react'));

var EditBookmarkPage = React.createClass({
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
          <EditBookmarkComponent
            folderList={this.state.folderList}
          />
        </div>
        <MobileNav/>
      </div>
    )
  }
});
module.exports = EditBookmarkPage;
