var BookmarksFolderComponent = React.createClass({
  render: function() {
    return (
      <div className="column- folderContainer">
        <div className="folder">
          <h2>{this.props.name}</h2>
          <a className="folderToggle openFolder" href="/bookmarx/{this.props.id}">
            <img src="/img/ic_keyboard_arrow_up_black_48dp_2x.png" alt="arrow"/></a>
          <a href="/foldersetting/{id}"><img className="verticalmenu" src="/img/ic_more_horiz_black_48dp_2x.png" alt="settings"/></a>
        </div>
      </div>
    )
  }
});

var FolderContainerComponent = React.createClass({
  getInitialState: function () {
    return {folderList: []};
  },
  componentDidMount: function() {
     this.serverRequest = $.get(this.props.source, function (result) {
       this.setState({
         folderList: result
       });
     }.bind(this));
   },
  render: function () {
    var folderNodes = this.state.folderList.map(function(folder) {
      return (
        <BookmarksFolderComponent
                 name={folder.name}
                 key={folder.id}
                 id={folder.id}
                 />
      );
    });
    return (
          <div className="slide desktopView">
        {folderNodes}
      </div>
    );
  }
});

var BookmarkComponent = React.createClass({
  render: function() {
    var favButton;
    if (this.props.favorite) {
      favButton = <button className="fab favorite"><img src="/img/ic_star_white_48dp_2x.png" alt="star"></img></button>;
    }
    else {
      favButton = <button className="fab"><img src="/img/ic_star_white_48dp_2x.png" alt="star"></img></button>;
    }
    return (
      <li>
        <div className="bookmark">
          <a href='/bookmarx/click/{id}'>
            <h2>{this.props.name}</h2>
            <h3>{this.props.url}</h3>
          </a>
          <a className="closeButton" href="/bookmarx/delete/{id}/{folder_id}/1"><img src="/img/ic_close_black_48dp_2x.png" alt="x"></img></a>
          <div className="card__action-bar">
            <form action="/bookmarx/staraction/1" method="POST">
              <input type="hidden" name="bookmarx_id" value="{bookmarx.id}"></input>
              {favButton}
            </form>
            <a className="card__button" href="/bookmarx/edit/{id}/{folder_id}/1">EDIT</a>
          </div>
        </div>
      </li>
    )
  }
});

var BookmarxContainerComponent = React.createClass({
  getInitialState: function () {
    return {bookmarksList: []};
  },
  componentDidMount: function() {
     this.serverRequest = $.get(this.props.source, function (result) {
       this.setState({
         bookmarksList: result
       });
     }.bind(this));
   },
  render: function () {
    var bookmarkNodes = this.state.bookmarksList.map(function(bookmark) {
      return (
        <BookmarkComponent
                 name={bookmark.name}
                 description={bookmark.description}
                 folder_id={bookmark.folder_id}
                 favorite={bookmark.favorite}
                 url={bookmark.url}
                 key={bookmark.id}
                 id={bookmark.id}
                 />
      );
    });
    return (
      <div className="slide">
        <div className="folderContent">
          <ul>
            {bookmarkNodes}
          </ul>
        </div>
      </div>
    );
  }
});

var NavBar = React.createClass({
  getInitialState: function () {
    return {
      ordering: 'asc',
      searchInput: ''
    };
    //return {ordering: this.props.ordering};
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
    // TODO
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

var MobileFolderSwitcher = React.createClass({
  render: function () {
    return (
      <option value={this.props.id}>{this.props.name}</option>
    );
  }
});

var MobileFolderSwitcherContainer = React.createClass({
  getInitialState: function () {
    return {folderList: []};
  },
  componentDidMount: function() {
     this.serverRequest = $.get(this.props.source, function (result) {
       this.setState({
         folderList: result
       });
     }.bind(this));
   },
  render: function () {
    var folderNodes = this.state.folderList.map(function(folder) {
      return (
        <MobileFolderSwitcher
        name={folder.name}
        id={folder.id}
        />
      )
    });
    return (
      <div className="slide mobileView">
        <div className="column- folderContainer">
          <form action="/bookmarx/" method="GET">
            <span className="folder_label_mobile">Folder: </span>
              <select  name="folder_id">
                {folderNodes}
              </select>
            <input type="submit" value="Change"></input>
          </form>
        </div>
      </div>
    );
  }
});

var MobileNav = React.createClass({
  render: function() {
    return (
      <nav className="nav-mobile mobileView">
        <ul className="mobileView">
          <li><a href="/bookmarx/favorites"><img src="/img/ic_star_white_48dp_2x.png" alt="favorite"></img></a></li>
          <li><a href="/bookmarx/mostvisited"><img src="/img/ic_pets_white_48dp_2x.png" alt="mostvisited"></img></a></li>
          <li className="active"><a href="/bookmarx"><img src="/img/ic_home_white_48dp_2x.png" alt="home"></img></a></li>
          <li><a href="/bookmarx/addfolder"><img src="/img/ic_create_new_folder_white_48dp_2x.png" alt="addfolder"></img></a></li>
          <li><a href="/bookmarx/settings"><img src="/img/ic_settings_white_48dp_2x.png" alt="settings"></img></a></li>
        </ul>
      </nav>
    )
  }
});

var SideBar = React.createClass({
  render: function() {
    return (
      <section className="side-nav-container desktopView">
        <h2>Quicklinks</h2>
        <ul>
          <li className="side-nav-divider"></li>
          <li><a href="/bookmarx">My BookMarx</a></li>
          <li><a href="/bookmarx/mostvisited">Most Visited</a></li>
          <li><a href="/bookmarx/favorites">Favorites</a></li>
        </ul>
      </section>
    );
  }
});

var HomeContainer = React.createClass({
  render: function() {
    return (
      <div>
        <NavBar/>
        <div className="container">
          <SideBar/>
          <section className="slide-container">
            <FolderContainerComponent
              source="/api/getfolders"/>
            <MobileFolderSwitcherContainer/>
          </section>
          <section className="right-container">
            <BookmarxContainerComponent
              source="/api/getbookmarks"/>
          </section>
        </div>
        <MobileNav/>
      </div>
    );
  }
});

ReactDOM.render(
  <HomeContainer/>,
  document.getElementById('maincontainer')
);
