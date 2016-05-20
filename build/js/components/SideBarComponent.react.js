var React = require('react');

var SideBar = React.createClass({
  render: function() {
    return (
      <section className="side-nav-container desktopView">
        <h2>Quicklinks</h2>
        <ul>
          <li className="side-nav-divider"></li>
          <li><a href="/bookmarx">My BookMarx</a></li>
          <li><a href="/bookmarx/mostvisited">Most Visited</a></li>
          <li><a href="/bookmarx/favorites">Favorites</a></li>
        </ul>
      </section>
    );
  }
});

module.exports = SideBar;
