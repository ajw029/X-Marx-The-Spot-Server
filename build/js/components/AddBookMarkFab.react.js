var React = require('react');

var AddBookmarkContainer = React.createClass({
  render: function() {
    return (
      <div className="overlayContainer">
        <a className="fab" href="/bookmarx/add"><img src="/img/ic_add_white_48dp_2x.png" alt="plus"></img></a>
      </div>
    )
  }
});
module.exports = AddBookmarkContainer;
