var OptionComponent = React.createFactory(require('../components/OptionComponent.react'));

var Keyword = React.createClass({
  render: function() {
    return (
    <div className="hashtaggroup">
      <input type="checkbox" name="oldkeyword_ids" value={this.props.id}></input>
      <p>{this.props.name}</p>
    </div>);
  }
});

var EditBookmarkPage = React.createClass({
  getInitialState: function () {
    return {
      folderList: [],
      bookmark: {},
      title: '',
      url: '',
      desc: '',
      keywords: '',
      oldkeywords: [],
      oldkeywordsOutput: [],
      curFolder: '',
      overallErr: false,
      titleErr: false,
      urlErr: false,
      descErr: false,
      newKeywordErr: false
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
    var curFolder = this.state.curFolder;
    var keywords = this.state.keywords;

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

    var checkedKeywords = [];
    var items = 0;
    $('.hashtaggroup').find('input').each(function(index) {
      if ($(this).is(':checked')) {
        checkedKeywords.push(parseInt(this.value));
      }
      items++;
    });
    this.oldkeywordsOutput = JSON.stringify(checkedKeywords);

    // Check if All keywords have been checked off and theres no keywords
    if (checkedKeywords.length == items && !keywords.trim()) {
      okay = false;
      this.setState({newKeywordErr: true});
    }
    else {
      this.setState({newKeywordErr: false});
    }

    if (!curFolder) {
      okay = false;
      this.setState({folderErr: true});
    }
    else {
      this.setState({folderErr: false});
    }
    return okay;

  },
  submit: function() {
    var okay = this.validateSubmit();
    var body = {};
    body.title= this.state.title;
    body.url= this.state.url;
    body.desc= this.state.desc;
    body.keywords= this.state.keywords;
    body.oldkeywords=this.oldkeywordsOutput;
    body.folder= parseInt(this.state.curFolder);
    body.bookmark_id = this.state.bookmark_id;

    if (okay) {
      $.ajax({
            url: '/api/edit',
            dataType: 'json',
            cache: false,
            type: 'post',
            data: body,
            success: function(data) {
              browserHistory.push('/app/home')
            }.bind(this),
            error: function(xhr, status, err) {
              this.setState({overallErr: JSON.stringify(err)});
              console.error(JSON.stringify(err));
            }.bind(this)
      });
    }
  },
  componentDidMount: function() {
    var id = this.props.routeParams.bookmarx_id;
    // Gets all the folders
    this.serverRequest = $.get("/api/getfolders", function (result) {
      var body = {};
      body.bookmark_id = id;

      this.serverRequest = $.get("/api/getbookmark", body, function (result2) {
        if (!result2 || result2.length < 1) {
          window.location = '/app/home';
        }
        var oldkeywordsList = [];
        for (var i=0; i< result2.length; i++) {
          var keyword_item = {};
          keyword_item.name=result2[i].keyword;
          keyword_item.keyword_id=result2[i].keyword_id;
          oldkeywordsList.push(keyword_item);
        }
        this.setState({
          bookmark_id: id,
          bookmark: result2,
          folderList: result,
          title: result2[0].name,
          url: result2[0].url,
          desc: result2[0].description,
          oldkeywords:oldkeywordsList,
          curFolder: result2[0].folder_id,
        });
      }.bind(this));
    }.bind(this));
  },
  render: function() {
    var folderNodes = this.state.folderList.map(function(folder) {
      return (
        <OptionComponent
        name={folder.name}
        id={folder.id}
        key={folder.id}
        curSelect={this.state.curFolder}
        />
      )
    }.bind(this));
    var key = 0;

    var keywordNodes = this.state.oldkeywords.map(function(keyword) {
      key++;
      return (
        <Keyword
          name={keyword.name}
          id={keyword.keyword_id}
          key={key}
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
                <h1>Editing</h1>
                <div className="inputgroup">
                   <ToggleDisplay show={this.state.overallErr}>
                    <span className="errMsg">{this.state.overallErr}</span>
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
                  {keywordNodes}
                </div>
                <div className="labelgroup">
                  <label>Folder</label>
                </div>
                <div className="inputgroup">
                  <select name="folder" onChange={this.updateSelectValue} value={this.state.curFolder}>
                    {folderNodes}
                  </select>
                </div>
                <div className="inputgroup">
                  <button type="button" onClick={this.submit} className="boxButton okayButton">Save</button>
                  <Link to={'/app/home'} className="boxButton cancelButton">Cancel</Link>
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
