var OptionComponent = React.createFactory(require('../components/OptionComponent.react'));

var AddBookmarkPage = React.createClass({
  getInitialState: function () {
    mixpanel.track("Add Bookmark");
    return {
      folderList: [],
      curFolder: '',
      title: '',
      url: '',
      desc: '',
      keywords: '',
      curFolder: ' ',
      titleErr: false,
      urlErr: false,
      descErr: false,
      keywordErr: false,
      folderErr: false,
      overallErr: false
      };
  },
  validateSubmit: function() {
    var okay = true;
    var title = this.state.title.trim();
    var url = this.state.url.trim();
    var desc = this.state.desc.trim();
    var keywords = this.state.keywords.trim();
    var folders = this.state.curFolder;

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
    if (!keywords) {
      okay = false;
      this.setState({keywordErr: true});
    }
    else {
      this.setState({keywordErr: false});
    }
    if (!folders) {
      okay = false;
      this.setState({folderErr: true});
    }
    else {
      this.setState({folderErr: false});
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
  componentDidMount: function() {
    // Gets all the folders
    this.serverRequest = $.get("/api/getfolders", function (result) {
      this.setState({
        folderList: result,
      });
      if (!this.state.curFolder.trim() && result && result.length > 0) {
        this.setState({
          curFolder: result[0].id
        });
      }
    }.bind(this));
   },
   submit: function() {
     var okay = this.validateSubmit();
     if (okay) {
       var body = {};
       body.title= this.state.title;
       body.url= this.state.url;
       body.desc= this.state.desc;
       body.keywords= this.state.keywords;
       body.folder= this.state.curFolder;
       $.ajax({
             url: '/api/add',
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
                 //window.location = '/';
               }
               else {
                 this.setState({overallErr: true});
               }
             }.bind(this)
           });
         mixpanel.track("add bookmark");
     }
   },

  render: function() {
    var folderNodes = this.state.folderList.map(function(folder) {
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
                <h1>Create New BookMarx</h1>
                <div className="inputgroup">
                  <ToggleDisplay show={this.state.overallErr}>
                    <span className="errMsg">Could not Create Bookmark</span>
                  </ToggleDisplay>
                </div>
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
                  <select name="folder" onChange={this.updateSelectValue} value={this.state.curFolder}>
                    {folderNodes}
                  </select>
                  <ToggleDisplay show={this.state.folderErr}>
                    <span className="errMsg">Please add pick a folder</span>
                  </ToggleDisplay>
                </div>
                <div className="inputgroup">
                  <button type="button" onClick={this.submit} className="boxButton okayButton">Save</button>
                  <Link to={'/app/home'} className="boxButton cancelButton">Cancel</Link>
                </div>
            </div>
          </section>
        </div>
        <MobileNav/>
      </div>
    )
  }
});
module.exports = AddBookmarkPage;
