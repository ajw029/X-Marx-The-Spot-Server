var React = require('react');

var EditBookmarkComponent = React.createClass({
  render: function() {
    return (
    <section className="slide">
      <div className="formcontainer column-40">
        <a className="form_backbutton" href="<%= referer %>"><img src="/img/ic_arrow_back_black_48dp_2x.png" alt="back"></img></a>
        <form action="/bookmarx/edit" onsubmit="return validateEditBookmark()" method="POST">
          <h1>Edit {this.props.name}</h1>
          <div className="inputgroup">
            <input type="text" name="title" required></input>
            <span className="bar"></span>
            <label>Title</label>
          <span className="errMsg hide" id="title_errlabel">Please add a title</span>
          </div>
          <div className="inputgroup">
            <input type="text" name="url" required/>
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
            <input type="text" name="keywords"/>
            <span className="bar"></span>
            <label>New Keywords</label>
          <span className="errMsg hide" id="keywords_errlabel">Please add keywords</span>
          <span className="inputtext_hint">(Please seperate keywords with a space)</span>
          </div>
          <div className="hashtagcontainer">
            <label><i>Click to Delete Keyword</i></label>
              <div className="hashtaggroup">
                <input type="checkbox" name="oldkeyword_ids" value="<%=keyword.k_id%>"/>
                <p>keyword</p>
              </div>
          </div>
          <div className="labelgroup">
            <label>Folder</label>
          </div>
          <div className="inputgroup">
            <select name="folder">
            </select>
          </div>
          <input type="hidden" name="bookmarx_id" value="<%= bookmarx.id %>"></input>
          <input type="hidden" name="referer" value="<%= referer %>"></input>
          <div className="inputgroup">
            <input type="submit" className="boxButton okayButton" value="Save"></input>
            <a className="boxButton cancelButton" href="<%= referer %>">Cancel</a>
          </div>
        </form>
      </div>
    </section>
    )
  }
});
module.exports = EditBookmarkComponent;
