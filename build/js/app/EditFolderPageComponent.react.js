var EditFolderPage = React.createClass({
  getInitialState: function () {
    return {
      folderList: [],
      title: ''
      };
  },
  updateTitle: function(event) {
     mixpanel.track("Update Folder Title");
    this.setState({title: event.target.value})
  },
  validateSubmit: function() {
     mixpanel.track("submit update Folder");
    var okay = true;
    var title = this.state.title;
    if (!title || !title.trim()) {
      $('#folder_errlabel').removeClass('hide');
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
          timeout: 5000,
          success: function(data) {
            browserHistory.push('/app/home')
          }.bind(this),
          error: function(xhr, status, err) {
            //timeout or connection refused
            if(status == "timeout" || xhr.readyState == 0) {
              //window.location = '/';
            }
            else {
              this.setState({overallErr: true});
            }
          }.bind(this)
        });
        mixpanel.track("edit folders");
      return false;
    }
  },
  deleteFolder: function() {
     mixpanel.track("Delete Folder");
    var body = {};
    body.folder_id = this.props.routeParams.folder_id;
    $.ajax({
        url: '/api/deletefolder',
        dataType: 'json',
        cache: false,
        type: 'post',
        data: body,
        timeout: 5000,
        success: function(data) {
            browserHistory.push('/app/home')
        }.bind(this),
        error: function(xhr, status, err) {
          //timeout or connection refused
          if(status == "timeout" || xhr.readyState == 0) {
            //window.location = '/';
          }
          else {
            this.setState({overallErr: true});
          }
        }.bind(this)
      });
  },
  componentDidMount: function() {
    // Gets all the folders
    var body = {};
    body.folder_id= this.props.routeParams.folder_id;

    var folderId = this.props.routeParams.folder_id;
    if (isNaN(folderId) || folderId < 0) {
      browserHistory.push('/app/home')
    }
    else {
      $.ajax({
          url: "/api/getfolder",
          dataType: 'json',
          cache: false,
          type: 'get',
          data: body,
          timeout: 5000,
          success: function(data) {
            var result = data;
            if (!result || result.length < 1) {
                window.location = '/app/home';
            }
          this.setState({
            folder: result,
            title: result[0].name
          });
          }.bind(this),
          error: function(xhr, status, err) {
            //window.location = '/app/home';
          }.bind(this)
        });
    }


  },
  render: function() {
    return (
      <div>
        <NavBar/>
        <div className="container">
          <section className="slide">
            <div className="formcontainer column-40">
              <BackButton/>
                <h1>Edit {this.props.name}</h1>
                <div className="inputgroup">
                  <input type="text" onChange={this.updateTitle} name="newname" value={this.state.title} required></input>
                  <span className="bar"></span>
                  <label>Title</label>
                  <span className="errMsg hide" id="folder_errlabel">Please enter a folder name</span>
                </div>
                <div className="inputgroup actionContainer">
                  <button onClick={this.submit} type="button" className="boxButton okayButton" >Save</button>
                  <Link to={'/app/home'} className="boxButton cancelButton">Cancel</Link>
                </div>
                <div className="inputgroup actionContainer">
                  <input type="hidden" name="folder_id"></input>
                  <button onClick={this.deleteFolder} type="button" className="boxButton deleteButton">Delete</button>
                </div>
            </div>
          </section>
        </div>
        <MobileNav/>
      </div>
    )
  }
});
module.exports = EditFolderPage;
