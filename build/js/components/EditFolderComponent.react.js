var React = require('react');
var BackButton = React.createFactory(require('./FormBackButtonComponent.react'));
var Link = require('react-router').Link;

var EditFolderComponent = React.createClass({
  getInitialState: function () {
    return ({
      title: this.props.name
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

    }
  },
  deleteFolder: function() {

  },
  render: function() {
    return (
    <section className="slide">
      <div className="formcontainer column-40">
        <BackButton/>
        <form action="/bookmarx/updatefolder/<%= folder.id %>" method="POST">
          <h1>Edit {this.props.name}</h1>
          <div className="inputgroup">
            <input type="text" onChange={this.updateTitle} name="newname" value={this.state.title} required></input>
            <span className="bar"></span>
            <label>Title</label>
            <span className="errMsg hide" id="folder_errlabel">Please enter a folder name</span>
          </div>

          <div className="inputgroup actionContainer">
            <button onClick={this.submit} type="button" className="boxButton okayButton" >Create</button>
            <Link to={'/home'} className="boxButton cancelButton">Cancel</Link>
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
    )
  }
});
module.exports = EditFolderComponent;
