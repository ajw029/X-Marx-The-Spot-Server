var MobileNav = React.createClass({
  render: function() {
    return (
      <nav className="nav-mobile mobileView">
        <ul className="mobileView">
          <li><Link to={'/app/myfavlinks'}><img src="/img/ic_star_white_48dp_2x.png" alt="favorite"></img></Link></li>
          <li><Link to={'/app/myrecent'}><img src="/img/ic_pets_white_48dp_2x.png" alt="mostvisited"></img></Link></li>
          <li className="active"><Link to={'/app/home'}><img src="/img/ic_home_white_48dp_2x.png" alt="home"></img></Link></li>
          <li><Link to={'/app/addnewfolder'}><img src="/img/ic_create_new_folder_white_48dp_2x.png" alt="addfolder"></img></Link></li>
          <li><Link to={'/app/gotosettings'}><img src="/img/ic_settings_white_48dp_2x.png" alt="settings"></img></Link></li>
        </ul>
      </nav>
    )
  }
});

module.exports = MobileNav;
