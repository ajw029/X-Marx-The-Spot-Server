var React = require('react');

var MobileNav = React.createFactory(require('../components/MobileNavComponent.react'));
var NavBar = React.createFactory(require('../components/Nav.react'));
var SettingsComponent = React.createFactory(require('../components/SettingsComponent.react'));

var SettingsPageComponent = React.createClass({
   render: function() {
     return (
      <div>
        <NavBar/>
        <SettingsComponent/>
        <MobileNav/>
      </div>
    );
  }
});
module.exports = SettingsPageComponent;
