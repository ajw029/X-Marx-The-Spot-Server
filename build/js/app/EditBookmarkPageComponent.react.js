var OptionComponent = React.createFactory(require('../components/OptionComponent.react'));

var Keyword = React.createClass({
  render: function() {
    return (
    <div className="hashtaggroup">
      <input type="checkbox" name="oldkeyword_ids" value={this.props.k_id}></input>
      <p>keyword</p>
    </div>);
  }
})

var EditBookmarkPage = React.createClass({
  getInitialState: function () {
    return {
      folderList: [],
      bookmark: {}
      };
  },
  getInitialState: function () {
    var bookmarks = this.props.bookmark;
    console.log(bookmarks)
    var tempBookmark = bookmarks[0];
    console.log(tempBookmark)
    if (!tempBookmark) {
      return {
        title: '',
        url: '',
        desc: '',
        keywords: '',
        folders: '',
        titleErr: false,
        urlErr: false,
        descErr: false,
        newKeywordErr: false
      };
    }
    else {
      return {
        title: tempBookmark.name,
        url: '',
        desc: '',
        keywords: '',
        folders: '',
        titleErr: false,
        urlErr: false,
        descErr: false,
        newKeywordErr: false
      };
    }
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
      this.setState({newKeywordErr: true});
    }
    else {
      this.setState({newKeywordErr: false});
    }
    if (!folders || !folders.trim()) {
      okay = false;
    }
    else {

    }
    return okay;

  },

  submit: function() {
    var okay = this.validateSubmit();

    if (okay) {

    }
  },
  componentDidMount: function() {
    var res = window.location.href.split("/");
    var id = res[res.length-1];
    // Gets all the folders
    this.serverRequest = $.get("/api/getfolders", function (result) {
      var body = {};
      body.bookmark_id = id;
      this.serverRequest = $.get("/api/getbookmark", body, function (result2) {

        this.setState({
          bookmark: result2,
          folderList: result
        });
        this.forceUpdate();

      }.bind(this));
    }.bind(this));
  },
  render: function() {
    console.log(this.state.bookmark)

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
      <div>
        <NavBar/>
        <div className="container">
          <section className="slide">
            <div className="formcontainer column-40">
              <BackButton/>
              <form action="/bookmarx/edit" method="POST">
                <h1>Edit {this.props.name}</h1>
                <div className="inputgroup">
                  <input type="text" name="title" onChange={this.updateTitle} value={this.state.title} autofocus required></input>
                  <span className="bar"></span>
                  <label>Title</label>
                  <ToggleDisplay show={this.state.titleErr}>
                    <span className="errMsg" id="title_errlabel">Please add a title</span>
                  </ToggleDisplay>
                </div>
                <div className="inputgroup">
                  <input type="text" name="url" onChange={this.updateURL} value={this.state.url} required/>
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
                  <input type="text" name="keywords" onChange={this.updateKeywords} value={this.state.keywords}></input>
                  <span className="bar"></span>
                  <label>New Keywords</label>
                  <ToggleDisplay show={this.state.newKeywordErr}>
                    <span className="errMsg" id="keywords_errlabel">Please add keywords</span>
                  </ToggleDisplay>
                  <span className="inputtext_hint">(Please seperate keywords with a space)</span>
                </div>
                <div className="hashtagcontainer">
                  <label><i>Click to Delete Keyword</i></label>

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
          </div>
        <MobileNav/>
      </div>
    )
  }
});
module.exports = EditBookmarkPage;
