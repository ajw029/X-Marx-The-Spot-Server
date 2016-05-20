var React = require('react');

var MobileFolderSwitcher = React.createClass({
  render: function () {
    return (
      <option value={this.props.id}>{this.props.name}</option>
    );
  }
});

var MobileFolderSwitcherContainer = React.createClass({
  getInitialState: function () {
    return {folderList: [],
            curFolder: this.props.curFolder};
  },
  componentDidMount: function() {
     this.serverRequest = $.get(this.props.source, function (result) {
       this.setState({
         folderList: result
       });
     }.bind(this));
   },
   updateSelectValue: function(event) {
    this.setState({curFolder: event.target.value});
   },
   changeFolders() {
     this.props.getBookmarks(this.state.curFolder)
   },
   render: function () {
     var folderNodes = this.props.folderList.map(function(folder) {
       return (
         <MobileFolderSwitcher
          name={folder.name}
          id={folder.id}
          key={folder.id}
        />
      )
    });
    return (
      <div className="slide mobileView">
        <div className="column- folderContainer">
          <form action="/bookmarx/" method="GET">
            <span className="folder_label_mobile">Folder: </span>
              <select onChange={this.updateSelectValue} value={this.state.curFolder} name="folder_id">
                {folderNodes}
              </select>
            <button type="button" onClick={this.changeFolders}>Change</button>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = MobileFolderSwitcherContainer;
