
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
            curFolder: this.props.curFolder,
            curFolderName: this.props.curFolderName
          };
  },
   updateSelectValue: function(event) {
    this.setState({curFolder: event.target.value});
   },
   changeFolders: function() {
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
    // TODO
    var showSettings = false;
    if (this.state.curFolderName && this.state.curFolderName == 'Default') {
      showSettings = false;
    }
    return (
      <div className="slide mobileView">
        <div className="column- folderContainer">
          <form action="/bookmarx/" method="GET">
            <span className="folder_label_mobile">Folder: </span>
              <select onChange={this.updateSelectValue} value={this.state.curFolder} name="folder_id">
                {folderNodes}
              </select>
              <ToggleDisplay show={showSettings}>
                <Link to={"/app/editmyfolder/"+this.props.curFolder}><img className="verticalmenu" src="/img/ic_more_horiz_black_48dp_2x.png" alt="settings"></img></Link>
              </ToggleDisplay>
              <button type="button" onClick={this.changeFolders}>Change</button>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = MobileFolderSwitcherContainer;
