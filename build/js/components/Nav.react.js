var React = require('react');

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
      if (!this.state.ordering) {
          return 'asc';
      }
      return this.state.ordering;
  },
  updateSearchValue: function(event) {
    this.setState({searchInput: event.target.value});
  },
  find: function() {
  },
  render: function() {
    return (
      <nav>
        <ul className="nav-title">
          <li><a href="index.html">BookMarx</a></li>
        </ul>
        <div className="searchContainer">
          <div className="folderSearchBar">
            <form action="/bookmarx/search" method="GET">
            <input type="text" onChange={this.updateSearchValue} name="search" placeholder="Search" value={this.state.searchInput}></input>
            <select onChange={this.updateSelectValue} value={this.state.ordering} name="ordering">
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
            <input type="submit" onClick={this.find} placeholder="Find"></input>
          </form>
          </div>
        </div>
        <ul className="navbar-right">
          <li className="navbar-hide"><a href="/bookmarx/add" className="tooltip"><img src="/img/ic_bookmark_white_48dp_2x.png" alt="bookmark"></img><span className="tooltiptext">Add a BookMarx</span></a></li>
          <li className="navbar-hide"><a href="/bookmarx/addfolder" className="tooltip"><img src="/img/ic_create_new_folder_white_48dp_2x.png" alt="folder"></img><span className="tooltiptext">Add a Folder</span></a></li>
          <li className="navbar-hide"><a href="/bookmarx/settings" className="tooltip"><img className="cog" src="/img/ic_settings_white_48dp_2x.png" alt="bookmark"></img><span className="tooltiptext">Settings</span></a></li>
          <li><a className="tooltip" href="/logout"><img src="/img/ic_exit_to_app_white_48dp_2x.png" alt="settings"></img><span className="tooltiptext">Logout</span></a></li>
        </ul>
      </nav>
    )
  }
});

module.exports = NavBar;
