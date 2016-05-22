var AddFolderComponent = React.createClass({
  getInitialState: function () {
    return ({
      title: ''
    });
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
      body.folder_title = this.state.title;
      $.ajax({
            url: '/api/addfolder',
            dataType: 'json',
            cache: false,
            type: 'post',
            data: body,
            timeout: 5000,
            success: function(data) {
              browserHistory.push('/app/home');
            }.bind(this),
            error: function(xhr, status, err) {
              //timeout or connection refused
              if(status == "timeout" || xhr.readyState == 0) {
                window.location = '/';
              }
            }.bind(this)
          });
    }
  },
  render: function() {
    return (
    <section className="slide">
      <div className="formcontainer column-40">
        <BackButton/>
        <form action="/bookmarx/addfolder" method="POST">
          <h1>Add Folder</h1>
          <div className="inputgroup">
            <input type="text" onChange={this.updateTitle} name="folder_title" autofocus required/>
            <span className="bar"></span>
            <label>Title</label>
            <span className="errMsg hide" id="folder_errlabel">Please enter a folder name</span>
          </div>
          <div className="inputgroup actionContainer">
            <button onClick={this.submit} type="button" className="boxButton okayButton" >Create</button>
            <Link to={'/app/home'} className="boxButton cancelButton">Cancel</Link>
          </div>
        </form>
      </div>
    </section>
    )
  }
});
module.exports = AddFolderComponent;
