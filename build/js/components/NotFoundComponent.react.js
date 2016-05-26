var NotFoundComponent = React.createClass({
  render: function() {
    return (
      <div id="ErrorBody">
        <div id='left'>
          <img src='/img/catline.png' alt="Cat Pic"/>
        </div>
        <div id='right'>
          <h1 id="errorH1">
            404
            <br/>
            O.O Sorry
          </h1>
          <Link to={'/app/home'} className="boxButton cancelButton">Home</Link>
        </div>
      </div>
      ) 
  }
});

module.exports = NotFoundComponent;