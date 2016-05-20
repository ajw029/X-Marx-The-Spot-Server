var AddBookmarkPage = React.createClass({
  getInitialState: function () {
    return {
      folderList: [],
      curFolder: ''
      };
  },
  componentDidMount: function() {
    // Gets all the folders
    this.serverRequest = $.get("/api/getfolders", function (result) {
      this.setState({
        folderList: result,

      });
      if (!this.state.curFolder.trim() && result && result.length > 0) {
        this.setState({
          curFolder: result[0].id
        });
      }
    }.bind(this));
   },
  render: function() {
    return (
      <div>
        <NavBar/>
        <div className="container">
          <AddBookmarkComponent
            folderList={this.state.folderList}
            source='/api/add'
            curFolder={this.state.curFolder}
            />
        </div>
        <MobileNav/>
      </div>
    )
  }
});
module.exports = AddBookmarkPage;
