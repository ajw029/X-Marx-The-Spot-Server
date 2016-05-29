var MobileNav = React.createClass({
  render: function() {
    return (
      <nav className="nav-mobile mobileView">
        <ul className="mobileView">
          <li><Link to="/app/myfavlinks" activeClassName="active"><img src="/img/ic_star_white_48dp_2x.png" alt="favorite"></img></Link></li>
          <li><Link to="/app/myrecent" activeClassName="active"><img src="/img/ic_pets_white_48dp_2x.png" alt="mostvisited"></img></Link></li>
          <li><Link to="/list.html" activeClassName="active"><img src="/img/ic_home_white_48dp_2x.png" alt="home"/></Link></li>
          <li><Link to="/app/addnewfolder" activeClassName="active"><img src="/img/ic_create_new_folder_white_48dp_2x.png" alt="addfolder"></img></Link></li>
          <li><Link to="/app/gotosettings" activeClassName="active"><img src="/img/ic_settings_white_48dp_2x.png" alt="settings"></img></Link></li>
        </ul>
      </nav>
    )
  }
});

module.exports = MobileNav;
