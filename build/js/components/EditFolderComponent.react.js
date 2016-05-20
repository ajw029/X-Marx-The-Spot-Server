var React = require('react');

var EditFolderComponent = React.createClass({
  render: function() {
    return (
    <section className="slide">
      <div className="formcontainer column-40">
        <a className="form_backbutton" href="/bookmarx"><img src="/img/ic_arrow_back_black_48dp_2x.png" alt="back"></img></a>
        <form action="/bookmarx/updatefolder/<%= folder.id %>" onsubmit="return validateAddFolder()" method="POST">
          <h1>Edit {this.props.name}</h1>
          <div className="inputgroup">
            <input type="text" name="newname" value="<%= folder.name %>" required></input>
            <span className="bar"></span>
            <label>Title</label>
            <span className="errMsg hide" id="folder_errlabel">Please enter a folder name</span>
          </div>

          <div className="inputgroup actionContainer">
            <input type="submit" className="boxButton okayButton" value="Save"></input>
            <a className="boxButton cancelButton" href="/bookmarx">Cancel</a>
          </div>
        </form>

        <form action="/bookmarx/deletefolder" method="POST">
          <div className="inputgroup actionContainer">
            <input type="hidden" name="folder_id"></input>
            <input type="submit" className="boxButton deleteButton" value="Delete"></input>
          </div>
        </form>

      </div>
    </section>
    )
  }
});
module.exports = EditFolderComponent;
