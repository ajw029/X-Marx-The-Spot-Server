var OptionComponent = React.createFactory(require('./OptionComponent.react'));

var AddBookmarkComponent = React.createClass({
  getInitialState: function () {
    return {
      title: '',
      url: '',
      desc: '',
      keywords: '',
      curFolder: this.props.curFolder,
      titleErr: false,
      urlErr: false,
      descErr: false,
      keywordErr: false
      };
  },
  setInitialFolderID(folderId) {
    this.setState({curFolder: folderId});
    console.log('setting curfolder to ' + folderId);
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
      this.setState({titleErr: true});
    }
    else {
      this.setState({titleErr: false});
    }
    if (!url || !url.trim()) {
      okay = false;
      this.setState({urlErr: true});
    }
    else {
      this.setState({urlErr: false});
    }
    if (!desc || !desc.trim()) {
      okay = false;
      this.setState({descErr: true});
    }
    else {
      this.setState({descErr: false});
    }
    if (!keywords || !keywords.trim()) {
      okay = false;
      this.setState({keywordErr: true});
    }
    else {
      this.setState({keywordErr: false});
    }
    if (!folders || !folders.trim()) {
      okay = false;
    }
    else {

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
    console.log("Cur Folder is " + this.state.curFolder);
    var okay = this.validateSubmit();
    if (okay) {
      $.ajax({
            url: this.props.source,
            dataType: 'json',
            cache: false,
            type: 'post',
            success: function(data) {
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
            <ToggleDisplay show={this.state.titleErr}>
              <span className="errMsg" id="title_errlabel">Please add a title</span>
            </ToggleDisplay>
          </div>
          <div className="inputgroup">
            <input type="text" name="url" onChange={this.updateURL} value={this.state.url} required></input>
            <span className="bar"></span>
            <label>URL</label>
            <ToggleDisplay show={this.state.urlErr}>
              <span className="errMsg" id="url_errlabel">Please add a URL</span>
            </ToggleDisplay>
          </div>
          <div className="inputgroup">
            <input type="text" name="desc" onChange={this.updateDesc} value={this.state.desc} required/>
            <span className="bar"></span>
            <label>Description</label>
            <ToggleDisplay show={this.state.descErr}>
              <span className="errMsg" id="descr_errlabel">Please add a description</span>
            </ToggleDisplay>
          </div>
          <div className="inputgroup">
            <input type="text" name="keywords" onChange={this.updateKeywords} value={this.state.keywords} required></input>
            <span className="bar"></span>
            <label>Keywords</label>
            <ToggleDisplay show={this.state.keywordErr}>
              <span className="errMsg" id="keywords_errlabel">Please add keywords</span>
            </ToggleDisplay>
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
