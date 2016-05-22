var BookmarkComponent = React.createClass({
  getInitialState: function () {
    return {showDeleteButton: true,
            showDeleteConf: false};
  },

  favoriteClick: function() {
    var body = {};
    body.bookmarx_id=this.props.id;
    $.ajax({
          url: '/api/staraction',
          dataType: 'json',
          cache: false,
          type: 'post',
          data: body,
          timeout: 5000,
          success: function(data) {
            this.props.favBookmark(this.props.id)

          }.bind(this),
          error: function(xhr, status, err) {
            //timeout or connection refused
            if(status == "timeout" || xhr.readyState == 0) {
              window.location = '/';
            }
            this.props.favBookmarkErr();
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
          timeout: 5000,
          success: function(data) {
            this.props.deleteBookmark(this.props.id);

          }.bind(this),
          error: function(xhr, status, err) {
            //timeout or connection refused
            if(status == "timeout" || xhr.readyState == 0) {
              window.location = '/';
            }
            this.props.deleteBookmarkErr();
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
          timeout: 5000,
          success: function(data) {
          }.bind(this),
          error: function(xhr, status, err) {
            //timeout or connection refused
            if(status == "timeout" || xhr.readyState == 0) {
              window.location = '/';
            }
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
  showDelete: function() {
    this.setState({showDeleteButton: false,
                   showDeleteConf: true});
  },
  closeDeleteConf: function() {
    this.setState({showDeleteButton: true,
                   showDeleteConf: false});
                   console.log('hi')
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
          <ToggleDisplay show={this.state.showDeleteButton}>
            <button className="closeButton" onClick={this.showDelete}><img src="/img/ic_close_black_48dp_2x.png"  alt="x"></img></button>
          </ToggleDisplay>
          <ToggleDisplay show={this.state.showDeleteConf}>
            <div className="deleteConfirmationContainer">
              <label>Delete?</label>
              <button className="confDelete deleteButton" onClick={this.deleteBookmark}>Yes</button>
              <button className="confDelete cancelButton" onClick={this.closeDeleteConf}>No</button>
            </div>
          </ToggleDisplay>

          <div className="card__action-bar">
          {favButton}
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
                 favBookmarkErr={this.props.favBookmarkErr}
                 deleteBookmarkErr={this.props.deleteBookmarkErr}
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
