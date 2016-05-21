var EditFolderPage = React.createClass({
  getInitialState: function () {
    return {
      folderList: [],
      title: ''
      };
  },
  updateTitle: function(event) {
    this.setState({title: event.target.value})
  },
  validateSubmit: function() {
    var okay = true;
    var title = this.state.title;
    if (!title || !title.trim()) {
      okay = false;
    }
    return okay;
  },
  submit: function() {
    var okay = this.validateSubmit();
    if (okay) {
      var body = {};
      body.folder_id = this.props.routeParams.folder_id;
      body.newname =this.state.title;
      $.ajax({
          url: '/api/updatefolder',
          dataType: 'json',
          cache: false,
          type: 'post',
          data: body,
          success: function(data) {
            browserHistory.push('/app/home')
          }.bind(this),
          error: function(xhr, status, err) {
            this.setState({overallErr: true});
          }.bind(this)
        });
    }
  },
  deleteFolder: function() {
    var body = {};
    body.folder_id = this.props.routeParams.folder_id;
    $.ajax({
        url: '/api/deletefolder',
        dataType: 'json',
        cache: false,
        type: 'post',
        data: body,
        success: function(data) {
            browserHistory.push('/app/home')
        }.bind(this),
        error: function(xhr, status, err) {
          this.setState({overallErr: true});
        }.bind(this)
      });
  },
  componentDidMount: function() {
    // Gets all the folders
    var body = {};
    body.folder_id= this.props.routeParams.folder_id;;
    this.serverRequest = $.get("/api/getfolder", body, function (result) {
      this.setState({
        folder: result,
        title: result[0].name
      });
    }.bind(this));
  },
  render: function() {
    return (
      <div>
        <NavBar/>
        <div className="container">
          <section className="slide">
            <div className="formcontainer column-40">
              <BackButton/>
              <form action="/bookmarx/updatefolder/" method="POST">
                <h1>Edit {this.props.name}</h1>
                <div className="inputgroup">
                  <input type="text" onChange={this.updateTitle} name="newname" value={this.state.title} required></input>
                  <span className="bar"></span>
                  <label>Title</label>
                  <span className="errMsg hide" id="folder_errlabel">Please enter a folder name</span>
                </div>
                <div className="inputgroup actionContainer">
                  <button onClick={this.submit} type="button" className="boxButton okayButton" >Create</button>
                  <Link to={'/app/home'} className="boxButton cancelButton">Cancel</Link>
                </div>
              </form>
              <form action="/bookmarx/deletefolder" method="POST">
                <div className="inputgroup actionContainer">
                  <input type="hidden" name="folder_id"></input>
                  <button onClick={this.deleteFolder} type="button" className="boxButton deleteButton">Delete</button>
                </div>
              </form>

            </div>
          </section>
        </div>
        <MobileNav/>
      </div>
    )
  }
});
module.exports = EditFolderPage;
