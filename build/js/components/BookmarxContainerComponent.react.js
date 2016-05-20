var BookmarkComponent = React.createClass({
  favoriteClick: function() {
    // TODO
  },
  deleteBookmark: function() {
    // TODO
  },
  render: function() {
    var favButton;
    if (this.props.favorite) {
      favButton = <button onClick={this.favoriteClick} className="fab favorite"><img src="/img/ic_star_white_48dp_2x.png" alt="star"></img></button>;
    }
    else {
      favButton = <button onClick={this.favoriteClick} className="fab"><img src="/img/ic_star_white_48dp_2x.png" alt="star"></img></button>;
    }
    var editUrl ='/editmybookmark/'+ this.props.id;
    return (
      <li>
        <div className="bookmark">
          <a href='/bookmarx/click/{id}'>
            <h2>{this.props.name}</h2>
            <h3>{this.props.url}</h3>
          </a>
          <a className="closeButton" onClick={this.deleteBookmark}><img src="/img/ic_close_black_48dp_2x.png" alt="x"></img></a>
          <div className="card__action-bar">
            <form action="/bookmarx/staraction/1" method="POST">
              <input type="hidden" name="bookmarx_id" value="{bookmarx.id}"></input>
              {favButton}
            </form>
            <Link to={editUrl} params={{bookmarx_id: this.props.id}} className="card__button">EDIT</Link>
          </div>
        </div>
      </li>
    )
  }
});

var BookmarxContainerComponent = React.createClass({
  render: function () {
    var bookmarkNodes = this.props.myBookmarks.map(function(bookmark) {
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

module.exports = BookmarxContainerComponent;
