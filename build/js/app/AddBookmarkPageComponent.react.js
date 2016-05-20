var AddBookmarkPage = React.createClass({
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
          <AddBookmarkComponent
            folderList={this.state.folderList}
            source='/api/addbookmark'
            />
        </div>
        <MobileNav/>
      </div>
    )
  }
});
module.exports = AddBookmarkPage;
