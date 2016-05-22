var AddBookmarkContainer = React.createClass({
  render: function() {
    return (
      <div className="overlayContainer">
        <Link to={'/app/addnewbookmark'} className="fab"><img src="/img/ic_add_white_48dp_2x.png" alt="plus"></img></Link>
      </div>
    )
  }
});
module.exports = AddBookmarkContainer;
