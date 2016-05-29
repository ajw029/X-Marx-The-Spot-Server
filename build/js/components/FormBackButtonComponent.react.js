var FormBackButton = React.createClass({
  render: function() {
    return (
        <Link to={'/list.html'} className="form_backbutton" ><img src="/img/ic_arrow_back_black_48dp_2x.png" alt="back"></img></Link>
    )
  }
});
module.exports = FormBackButton;
