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
