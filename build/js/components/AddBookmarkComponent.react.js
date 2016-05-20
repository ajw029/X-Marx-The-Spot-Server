var React = require('react');
var BackButton = React.createFactory(require('./FormBackButtonComponent.react'));

var AddBookmarkComponent = React.createClass({
  render: function() {
    return (
    <section className="slide">
      <div className="formcontainer column-40">
        <BackButton/>
        <form action="/bookmarx/add" onsubmit="return validateAddBookmark()" method="POST">
          <h1>Create New BookMarx</h1>
          <div className="inputgroup">
            <input type="text" name="title" autofocus required></input>
            <span className="bar"></span>
            <label>Title</label>
            <span className="errMsg hide" id="title_errlabel">Please add a title</span>
          </div>
          <div className="inputgroup">
            <input type="text" name="url" required></input>
            <span className="bar"></span>
            <label>URL</label>
            <span className="errMsg hide" id="url_errlabel">Please add a URL</span>
          </div>
          <div className="inputgroup">
            <input type="text" name="desc" required/>
            <span className="bar"></span>
            <label>Description</label>
            <span className="errMsg hide" id="descr_errlabel">Please add a description</span>
          </div>
          <div className="inputgroup">
            <input type="text" name="keywords" required></input>
            <span className="bar"></span>
            <label>Keywords</label>
            <span className="errMsg hide" id="keywords_errlabel">Please add keywords</span>
            <span className="inputtext_hint">(Please seperate keywords with a space)</span>
          </div>
          <div className="labelgroup">
            <label>Folder</label>
          </div>
          <div className="inputgroup">
            <select name="folder">
            </select>
          </div>
          <div className="inputgroup">
            <input type='submit' className="boxButton okayButton" value="Save"></input>
            <a className="boxButton cancelButton" href="/bookmarx">Cancel</a>
          </div>
        </form>
      </div>
    </section>
    )
  }
});
module.exports = AddBookmarkComponent;
