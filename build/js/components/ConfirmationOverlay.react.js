var ConfirmationOverlay = React.createClass({
  render: function() {
    return (
      <div className="bookmarkDeleteConf">
        <h1>{this.props.errMsg}</h1>
      </div>
    )
  }
});

module.exports = ConfirmationOverlay;
