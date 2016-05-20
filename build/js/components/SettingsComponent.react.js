var React = require('react');

var SettingsComponent = React.createClass({
  render: function () {
    return (
      <section className="slide">
        <div className="formcontainer column-40">
          <h1>Settings</h1>
          <a className="form_backbutton" href="/bookmarx"><img src="/img/ic_arrow_back_black_48dp_2x.png" alt="back"></img></a>
          <div className="settinggroup">
            <h2>Change Password</h2>
            <form action="updatepassword" onsubmit="return validateUpdatePwd()" method="POST">
              <div className="inputgroup">
                <input type="password" name="oldPassword"  autofocus required></input>
                <span className="bar"></span>
                <label>Original Password</label>
                <span className="errMsg hide" id="originalpwd_errlabel">Please input a password</span>
              </div>
              <div className="inputgroup">
                <input type="password" name="newPassword" required></input>
                <span className="bar"></span>
                <label>New Password</label>
                <span className="errMsg hide" id="newpwd_errlabel">Please input new password</span>
              </div>
              <div className="inputgroup">
                <input type="password" name="reNewPassword" required/>
                <span className="bar"></span>
                <label>Confirm New Password</label>
                <span className="errMsg hide" id="renewpwd_errlabel">Please confirm new password</span>
              </div>
              <div className="inputgroup">
                <input type="submit" className="boxButton okayButton" value="Change Password"/>
              </div>
            </form>
          </div>
          <div className="settinggroup">
            <h2>Import/Export Bookmarks</h2>
            <form action="import" method="POST">
              <div className="inputgroup">
                Please copy paste contents of backup into:
                <input type="text" name="bookmarksJsonText"></input>
                <input type="submit" className="boxButton okayButton" value="Import Bookmarks"></input>
              </div>
            </form>
            <form >
              <div className="inputgroup">
                <a className="boxButton cancelButton" href="/bookmarx/export">Export Bookmarks</a>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  }
});
module.exports = SettingsComponent;
