var React = require('react');
var Link = require('react-router').Link;

var SideBar = React.createClass({
  render: function() {
    return (
      <section className="side-nav-container desktopView">
        <h2>Quicklinks</h2>
        <ul>
          <li className="side-nav-divider"></li>
          <li><Link to={'home'}>My BookMarx</Link></li>
          <li><Link to={'myrecent'}>Most Visited</Link></li>
          <li><Link to={'myfavlinks'}>Favorites</Link></li>
        </ul>
      </section>
    );
  }
});

module.exports = SideBar;
