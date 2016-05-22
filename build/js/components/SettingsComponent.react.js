var SettingsComponent = React.createClass({
  getInitialState: function () {
    return {
      pwd: '',
      newpwd: '',
      repwd: '',
      overallErr: false
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
      $('#originalpwd_errlabel').removeClass('hide');
      okay = false;
    } else {
      $('#originalpwd_errlabel').addClass('hide');
    }
    if (!newpwd || !newpwd.trim()) {
      $('#newpwd_errlabel').removeClass('hide');
      okay = false;
    } else {
      $('#newpwd_errlabel').addClass('hide');
    }

    if (!repwd || !repwd.trim()) {
      $('#renewpwd_errlabel').removeClass('hide');
      okay = false;
    } else {
      $('#renewpwd_errlabel').addClass('hide');
    }

    if(newpwd != repwd) {
      $('#matchpwd_errlabel').removeClass('hide');
      okay = false;
    } else {
      $('#matchpwd_errlabel').addClass('hide');
    }

    return okay;
  },
  submit: function() {
    var okay = this.validateSubmit();
    if (okay) {
    var body = {};
        body.pwd= this.state.pwd;
        body.newpwd= this.state.newpwd;
        body.repwd= this.state.repwd;

        $.ajax({
              url: '/api/updatePassword',
              dataType: 'json',
              cache: false,
              type: 'post',
              data: body,
              timeout: 5000,
              success: function(data) {
                browserHistory.push('/app/home')
              }.bind(this),
              error: function(xhr, status, err) {
                //timeout or connection refused
                if(status == "timeout" || xhr.readyState == 0) {
                  window.location = '/';
                }
                else {
                  $('#server_errlabel').removeClass('hide');
                  this.setState({overallErr: true});
                }
              }.bind(this)
            });
    }
  },
  importBookmarks: function() {
    var body = {};
    body.bookmarksJsonText = $('#json_bookmark_import').val();

    $.ajax({
          url: '/api/import',
          dataType: 'json',
          cache: false,
          type: 'post',
          data: body,
          timeout: 5000,
          success: function(data) {
            browserHistory.push('/app/home');

          }.bind(this),
          error: function(xhr, status, err) {
            //timeout or connection refused
            if(status == "timeout" || xhr.readyState == 0) {
              window.location = '/';
            }

          }.bind(this)
        });

  },
  render: function () {
    return (
      <section className="slide">
        <div className="formcontainer column-40">
          <h1>Settings</h1>
          <BackButton/>

          <div className="settinggroup">
            <h2>Change Password</h2>
              <div className="inputgroup">
                <span className="errMsg hide" id="server_errlabel">Password change failed.</span>
              </div>
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
                <span className="errMsg hide" id="matchpwd_errlabel">New passwords do not match</span>
              </div>
              <div className="inputgroup">
                <button onClick={this.submit} type="button" className="boxButton okayButton">Change Password</button>
              </div>
          </div>
          <div className="settinggroup">
            <h2>Import/Export Bookmarks</h2>
            <div className="inputgroup">
              Please copy paste contents of backup into:
              <input type="text" id="json_bookmark_import" name="bookmarksJsonText"></input>
              <input type="submit" onClick={this.importBookmarks} className="boxButton okayButton" value="Import Bookmarks"></input>
            </div>
            <div className="inputgroup">
              <a className="boxButton cancelButton" href="/bookmarx/export">Export Bookmarks</a>
            </div>
          </div>
        </div>
      </section>
    );
  }
});
module.exports = SettingsComponent;
