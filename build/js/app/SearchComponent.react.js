
var SearchResultsComponent = React.createClass({
  getInitialState: function () {
    return {
      myBookmarks: []
      };
  },
   render: function() {
     return (
      <div>
        <NavBar/>
        <div className="container">
          <SideBar/>
          <section className="right-container center-container">
            <BookmarxContainerComponent
              myBookmarks={this.state.myBookmarks}/>
          </section>
        </div>
        <MobileNav/>
      </div>
    );
  },
  validateSubmit: function() {
    var okay = true;

    if(!query || !trim(query)) {
      okay = false;
      this.setState({newKeywordErr: true});
    }

    this.setState({query: $("input[name='search']")})
    console.log("query: " + this.state.query);
    console.log("searchInput: " + this.state.searchInput);

    return okay;

  },
  submit: function() {
    var okay = this.validateSubmit();
    var body = {};
    body.query = this.state.searchInput;

    console.log(body)
    
    if (okay) {
      $.ajax({
            url: '/api/search',
            dataType: 'json',
            cache: false,
            type: 'post',
            data: body,
            success: function(data) {
              
            }.bind(this),
            error: function(xhr, status, err) {
              
            }.bind(this)
      });
    }
});
module.exports = SearchResultsComponent;
