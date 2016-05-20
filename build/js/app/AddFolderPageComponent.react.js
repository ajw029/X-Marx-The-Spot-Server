var AddFolderPage = React.createClass({
  render: function() {
    return (
      <div>
        <NavBar/>
        <div className="container">
          <AddFolderComponent/>
        </div>
        <MobileNav/>
      </div>
    )
  }
});
module.exports = AddFolderPage;
