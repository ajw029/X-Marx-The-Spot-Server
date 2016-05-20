var OptionComponent = React.createFactory(require('./OptionComponent.react'));

require('react-toggle-display').ToggleDisplay;

var AddBookmarkComponent = React.createClass({
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
  validateSubmit: function() {
    var okay = true;
    var title = this.state.title;
    var url = this.state.url;
    var desc = this.state.desc;
    var keywords = this.state.keywords;
    var folders = this.state.folders;
    if (!title || !title.trim()) {
      okay = false;
    }
    if (!url || !url.trim()) {
      okay = false;
      this.setState({titleErr: true});
    }
    else {
      this.setState({titleErr: false});
    }
    if (!url || !url.trim()) {
      okay = false;
    }
    if (!desc || !desc.trim()) {
      okay = false;
    }
    if (!keywords || !keywords.trim()) {
      okay = false;
    }
    if (!folders || !folders.trim()) {
      okay = false;
    }
    return okay;
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
      $.ajax({
            url: this.props.source,
            dataType: 'json',
            cache: false,
            type: 'post',
            success: function(data) {
              console.log('success');
              browserHistory.push('/home')
            }.bind(this),
            error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
            }.bind(this)
          });
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
        <form action="/bookmarx/add" onsubmit="return validateAddBookmark()" method="POST">
          <h1>Create New BookMarx</h1>
          <div className="inputgroup">
            <input type="text" name="title" onChange={this.updateTitle} value={this.state.title} autofocus required></input>
            <span className="bar"></span>
            <label>Title</label>
            <span className="errMsg" show={this.state.titleErr} id="title_errlabel">Please add a title</span>
          </div>
          <div className="inputgroup">
            <input type="text" name="url" required></input>
            <span className="bar"></span>
            <label>URL</label>
            <span className="errMsg hide" onChange={this.updateURL} value={this.state.url} id="url_errlabel">Please add a URL</span>
          </div>
          <div className="inputgroup">
            <input type="text" name="desc" required/>
            <span className="bar"></span>
            <label>Description</label>
            <span className="errMsg hide" onChange={this.updateDesc} value={this.state.desc} id="descr_errlabel">Please add a description</span>
          </div>
          <div className="inputgroup">
            <input type="text" name="keywords" onChange={this.updateKeywords} value={this.state.keywords} required></input>
            <span className="bar"></span>
            <label>Keywords</label>
            <span className="errMsg hide" id="keywords_errlabel">Please add keywords</span>
            <span className="inputtext_hint">(Please seperate keywords with a space)</span>
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
module.exports = AddBookmarkComponent;
