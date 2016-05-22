var SearchResultsComponent = React.createClass({
  getInitialState: function () {
    var ordering = this.props.routeParams.searchorder;
    var searchinput = this.props.routeParams.searchinput;

    return {
      myBookmarks: [],
      ordering: ordering,
      searchinput: searchinput
    };
  },
  componentDidMount: function() {
    // Gets all the folders
    var body = {};
    body.search = this.state.searchinput;
    body.ordering = this.state.ordering;
    if (body.search && body.ordering) {
      $.ajax({
            url: '/api/search',
            dataType: 'json',
            cache: false,
            type: 'get',
            data: body,
            success: function(data) {
              console.log(data)
              this.setState({myBookmarks: data.bookmarxList});
            }.bind(this),
            error: function(xhr, status, err) {
              this.setState({overallErr: true});
            }.bind(this)
          });
    }

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
  }
});
module.exports = SearchResultsComponent;
