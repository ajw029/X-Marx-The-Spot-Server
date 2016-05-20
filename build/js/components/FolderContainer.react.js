var React = require('react');

var BookmarksFolderComponent = React.createClass({
  changeFolders() {
    this.props.getBookmarks(this.props.id)
  },
  render: function() {
    var folderRedirect="/bookmarx/"+this.props.id;
    if (this.props.curFolder != this.props.id) {
      return (
        <div className="column- folderContainer">
          <div className="folder">
            <h2>{this.props.name}</h2>
            <a className="folderToggle openFolder" onClick={this.changeFolders}></a>
            <a href="/foldersetting/{id}"><img className="verticalmenu" src="/img/ic_more_horiz_black_48dp_2x.png" alt="settings"/></a>
          </div>
        </div>
      )
    }
    else {
      return (
      <div className="column- folderContainer">
        <div className="folder">
          <h2>{this.props.name}</h2>
          <a className="folderToggle openFolder" onClick={this.changeFolders}><img src="/img/ic_keyboard_arrow_up_black_48dp_2x.png" alt="arrow"></img></a>
          <a href="/foldersetting/{id}"><img className="verticalmenu" src="/img/ic_more_horiz_black_48dp_2x.png" alt="settings"/></a>
        </div>
      </div>);
    }
  }
});

var FolderContainerComponent = React.createClass({
  getInitialState: function () {
    return {folderList: this.props.folderList, curFolder: this.props.curFolder};
  },
  render: function () {
    var folderNodes = this.props.folderList.map(function(folder) {
      return (
        <BookmarksFolderComponent
                 curFolder={this.props.curFolder}
                 name={folder.name}
                 key={folder.id}
                 id={folder.id}
                 getBookmarks={this.props.getBookmarks}
                 />
      );
    }.bind(this));
    return (
          <div className="slide desktopView">
        {folderNodes}
      </div>
    );
  }
});

module.exports = FolderContainerComponent;
