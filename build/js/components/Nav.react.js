var NavBar = React.createClass({
  getInitialState: function () {
    return {
      ordering: 'asc',
      searchInput: ''
    };
  },
  updateSelectValue: function(event) {
    this.setState({ordering: event.target.value});
  },
  getSelectValue: function() {
     mixpanel.track("Select Sorting");
      if (!this.state.ordering) {
          return 'asc';
      }
      return this.state.ordering;
  },
  updateSearchValue: function(event) {
    this.setState({searchInput: event.target.value});
  },
  find: function() {
    if (!this.state.searchInput || !this.state.searchInput.trim() || !this.state.ordering) {
      this.setState({searchEmpty:true});
    }
    else {
      browserHistory.push("/list.html");
      browserHistory.push("/app/search/"+this.state.ordering+"/"+this.state.searchInput);
      this.setState({searchEmpty:false});
    }
  },
  returnFalse: function() {
    this.find();
    return false;
  },
  logout: function() {
    localStorage.removeItem('myFolders');
    localStorage.removeItem('curFolder');
    localStorage.removeItem('curFolderName');
    window.location = '/logout';
  },
  render: function() {
    var searchClass = "";
    if (this.state.searchEmpty) {
      searchClass = "searchErr"
    }
    return (
      <nav>
        <ul className="nav-title">
          <li><Link to={'/list.html'}>BookMarx</Link></li>
        </ul>
        <div className="searchContainer">
          <div className="folderSearchBar">
            <input className={searchClass} type="text" onChange={this.updateSearchValue} name="search" placeholder="Search" value={this.state.searchInput}></input>
            <select onChange={this.updateSelectValue} value={this.state.ordering} name="ordering">
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
            <input type="button" onClick={this.find} value="Find"></input>
          </div>
        </div>
        <ul className="navbar-right">
          <li className="navbar-hide"><Link to={"/app/addnewbookmark"} className="tooltip"><img src="/img/ic_bookmark_white_48dp_2x.png" alt="bookmark"></img><span className="tooltiptext">Add a BookMarx</span></Link></li>
          <li className="navbar-hide"><Link to={"/app/addnewfolder"} className="tooltip"><img src="/img/ic_create_new_folder_white_48dp_2x.png" alt="folder"></img><span className="tooltiptext">Add a Folder</span></Link></li>
          <li className="navbar-hide"><Link to={"/app/gotosettings"} className="tooltip"><img className="cog" src="/img/ic_settings_white_48dp_2x.png" alt="bookmark"></img><span className="tooltiptext">Settings</span></Link></li>
          <li><a className="tooltip" onClick={this.logout} ><img src="/img/ic_exit_to_app_white_48dp_2x.png" alt="settings"></img><span className="tooltiptext">Logout</span></a></li>
        </ul>
      </nav>
    )
  }
});

module.exports = NavBar;
