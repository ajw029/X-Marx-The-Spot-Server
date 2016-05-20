var SettingsComponent = React.createClass({
  getInitialState: function () {
    return {
      pwd: '',
      newpwd: '',
      repwd: '',
    }
  },
  updatePwd: function(event) {
    this.setState({pwd: event.target.value})
  },
  updateNewPwd: function(event) {
    this.setState({newpwd: event.target.value})
  },
  updateRePwd: function(event) {
    this.setState({repwd: event.target.value})
  },
  validateSubmit: function() {
    var okay = true;
    var pwd = this.state.pwd;
    var newpwd = this.state.newpwd;
    var repwd = this.state.repwd;

    if (!pwd || !pwd.trim()) {
      okay = false;
    }
    if (!newpwd || !newpwd.trim()) {
      okay = false;
    }
    if (!repwd || !repwd.trim()) {
      okay = false;
    }
    return okay;
  },
  submit: function() {
    var okay = this.validateSubmit();
    if (okay) {

    }
  },
  render: function () {
    return (
      <section className="slide">
        <div className="formcontainer column-40">
          <h1>Settings</h1>
          <BackButton/>
          <div className="settinggroup">
            <h2>Change Password</h2>
            <form action="updatepassword" onsubmit="return validateUpdatePwd()" method="POST">
              <div className="inputgroup">
                <input type="password" name="oldPassword" value={this.state.pwd} onChange={this.updatePwd} autofocus required></input>
                <span className="bar"></span>
                <label>Original Password</label>
                <span className="errMsg hide" id="originalpwd_errlabel">Please input a password</span>
              </div>
              <div className="inputgroup">
                <input type="password" name="newPassword" value={this.state.newpwd} onChange={this.updateNewPwd} required></input>
                <span className="bar"></span>
                <label>New Password</label>
                <span className="errMsg hide" id="newpwd_errlabel">Please input new password</span>
              </div>
              <div className="inputgroup">
                <input type="password" name="reNewPassword" value={this.state.repwd} onChange={this.updateRePwd} required/>
                <span className="bar"></span>
                <label>Confirm New Password</label>
                <span className="errMsg hide" id="renewpwd_errlabel">Please confirm new password</span>
              </div>
              <div className="inputgroup">
                <button onClick={this.submit} type="button" className="boxButton okayButton">Change Password</button>
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
