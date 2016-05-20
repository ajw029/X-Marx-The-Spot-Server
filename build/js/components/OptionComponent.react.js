var OptionComponent = React.createClass({
  render: function () {
    return (
      <option value={this.props.id}>{this.props.name}</option>
    );
  }
});
//selected={this.props.curSelect == this.props.id}
module.exports = OptionComponent;
