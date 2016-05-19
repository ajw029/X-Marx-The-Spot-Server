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
      <div>
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
      <div>
        <ul>
          {bookmarkNodes}
        </ul>
      </div>
    );
  }
});

ReactDOM.render(
  <FolderContainerComponent
    source="/api/getfolders"/>,
  document.getElementById('folderContainer')
);

ReactDOM.render(
  <BookmarxContainerComponent
    source="/api/getbookmarks"/>,
  document.getElementById('bookmarklist')
);
/*
var SearchBar = React.createClass({
  render: function () {
    return (
      <option></option>
    );
  }
});

ReactDOM.render(
  <SearchBar/>,
  document.getElementById('searchcontainer-react')
);
*/
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
      <form action="/bookmarx/" method="GET">
        <span class="folder_label_mobile">Folder: </span>
          <select  name="folder_id">
            {folderNodes}
          </select>
        <input type="submit" value="Change"></input>
      </form>

    );
  }
});

ReactDOM.render(
  <MobileFolderSwitcherContainer
    source="/api/getfolders"/>,
  document.getElementById('searchcontainer-react')
);
