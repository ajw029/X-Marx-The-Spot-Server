var React = require('react');

var AddFolderComponent = React.createClass({
  render: function() {
    return (
    <section className="slide">
      <div className="formcontainer column-40">
        <a className="form_backbutton" href="/bookmarx"><img src="/img/ic_arrow_back_black_48dp_2x.png" alt="back"></img></a>
        <form action="/bookmarx/addfolder" onsubmit="return validateAddFolder()" method="POST">
          <h1>Add Folder</h1>
          <div className="inputgroup">
            <input type="text" name="folder_title" autofocus required/>
            <span className="bar"></span>
            <label>Title</label>
            <span className="errMsg hide" id="folder_errlabel">Please enter a folder name</span>
          </div>
          <div className="inputgroup actionContainer">
            <input type="submit" className="boxButton okayButton" values="Create"></input>
            <a href='/bookmarx' className="boxButton cancelButton">Cancel</a>
          </div>
        </form>
      </div>
    </section>
    )
  }
});
module.exports = AddFolderComponent;
