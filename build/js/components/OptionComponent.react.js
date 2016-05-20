var OptionComponent = React.createClass({
  render: function () {
    return (
      <option value={this.props.id}>{this.props.name}</option>
    );
  }
});

module.exports = OptionComponent;
