var BookmarkComponent = React.createClass({
  favoriteClick: function() {
    var body = {};
    body.bookmarx_id=this.props.id;
    $.ajax({
          url: '/api/staraction',
          dataType: 'json',
          cache: false,
          type: 'post',
          data: body,
          success: function(data) {
            this.props.favBookmark(this.props.id)

          }.bind(this),
          error: function(xhr, status, err) {
          }.bind(this)
        });
  },
  deleteBookmark: function() {
    var body = {};
    body.bookmarx_id=this.props.id
    $.ajax({
          url: '/api/delete',
          dataType: 'json',
          cache: false,
          type: 'post',
          data: body,
          success: function(data) {
            this.props.deleteBookmark(this.props.id);

          }.bind(this),
          error: function(xhr, status, err) {
          }.bind(this)
        });
  },
  openLink: function() {
    var body = {};
    body.bookmarx_id=this.props.id;
    $.ajax({
          url: '/api/click',
          dataType: 'json',
          cache: false,
          type: 'get',
          success: function(data) {
          }.bind(this),
          error: function(xhr, status, err) {
          }.bind(this)
        });
        var redirectURL = this.props.url;
        if (redirectURL.indexOf('https://') > -1 || redirectURL.indexOf('http://')>-1){

        }
        else {
          redirectURL='http://'+ redirectURL;
        }

        window.location = redirectURL;
  },
  render: function() {
    var favButton;
    if (this.props.favorite) {
      favButton = <button type="button" onClick={this.favoriteClick} className="fab favorite"><img src="/img/ic_star_white_48dp_2x.png" alt="star"></img></button>;
    }
    else {
      favButton = <button type="button" onClick={this.favoriteClick} className="fab"><img src="/img/ic_star_white_48dp_2x.png" alt="star"></img></button>;
    }
    return (
      <li>
        <div className="bookmark">
          <a onClick={this.openLink}>
            <h2>{this.props.name}</h2>
            <h3>{this.props.url}</h3>
          </a>
          <a className="closeButton" onClick={this.deleteBookmark}><img src="/img/ic_close_black_48dp_2x.png" alt="x"></img></a>
          <div className="card__action-bar">
            <form action="/bookmarx/staraction/1" method="POST">
              <input type="hidden" name="bookmarx_id" value="{bookmarx.id}"></input>
              {favButton}
            </form>
            <Link to={'/app/editmybookmark/'+ this.props.id} className="card__button">EDIT</Link>
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
                 favBookmark={this.props.favBookmark}
                 deleteBookmark={this.props.deleteBookmark}
                 />
      );
    }.bind(this));
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
