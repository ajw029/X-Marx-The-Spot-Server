var React = require('react');
var BackButton = React.createFactory(require('./FormBackButtonComponent.react'));
var Link = require('react-router').Link;
var OptionComponent = React.createFactory(require('./OptionComponent.react'));

var EditBookmarkComponent = React.createClass({
  getInitialState: function () {
    return {
      title: '',
      url: '',
      desc: '',
      keywords: '',
      folders: '',
      titleErr: false
    };
  },
  updateTitle: function(event) {
    this.setState({title: event.target.value});
  },
  updateURL: function(event) {
    this.setState({url: event.target.value});
  },
  updateDesc: function(event) {
    this.setState({desc: event.target.value});
  },
  updateKeywords: function(event) {
    this.setState({keywords: event.target.value});
  },
  updateSelectValue: function(event) {
    this.setState({curFolder: event.target.value});
  },
  submit: function() {
    var okay = this.validateSubmit();
    if (okay) {

    }
  },
  render: function() {
    var folderNodes = this.props.folderList.map(function(folder) {
      return (
        <OptionComponent
        name={folder.name}
        id={folder.id}
        key={folder.id}
        />
      )
    });
    return (
      <section className="slide">
        <div className="formcontainer column-40">
          <BackButton/>
          <form action="/bookmarx/edit" method="POST">
            <h1>Edit {this.props.name}</h1>
            <div className="inputgroup">
              <input type="text" name="title" value={this.state.title} onChange={this.updateTitle} required></input>
              <span className="bar"></span>
              <label>Title</label>
              <span className="errMsg hide" id="title_errlabel">Please add a title</span>
            </div>
            <div className="inputgroup">
              <input type="text" name="url" onChange={this.updateURL} value={this.state.url} required/>
              <span className="bar"></span>
              <label>URL</label>
              <span className="errMsg hide" id="url_errlabel">Please add a URL</span>
            </div>
            <div className="inputgroup">
              <input type="text" name="desc" onChange={this.updateDesc} value={this.state.desc} required/>
              <span className="bar"></span>
              <label>Description</label>
              <span className="errMsg hide" id="descr_errlabel">Please add a description</span>
            </div>
            <div className="inputgroup">
              <input type="text" name="keywords" onChange={this.updateKeywords} value={this.state.keywords}></input>
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
              <select name="folder" onChange={this.updateSelectValue}>
                {folderNodes}
              </select>
            </div>
            <div className="inputgroup">
              <button type="button" onClick={this.submit} className="boxButton okayButton">Save</button>
              <Link to={'/home'} className="boxButton cancelButton">Cancel</Link>
            </div>
          </form>
        </div>
      </section>
    )
  }
});
module.exports = EditBookmarkComponent;
