var SearchResultsComponent = React.createClass({
  getInitialState: function () {
    var ordering = this.props.routeParams.searchorder;
    var searchinput = this.props.routeParams.searchinput;
    return {
      myBookmarks: [],
      ordering: this.props.routeParams.searchorder,
      searchinput: this.props.routeParams.searchinput
    };
  },
  loadParams: function(nextProps) {
    this.setState({ordering: nextProps.searchorder,searchinput: nextProps.searchinput});
    this.loadSearch(nextProps.searchorder, nextProps.searchinput);
  },
  componentWillReceiveProps: function (nextProps) {
    this.loadParams(nextProps.params);
  },
  componentDidMount: function() {
    // Gets all the folders
    this.loadSearch();
   },
   loadSearch: function(searchorder, searchinput) {
     var body = {};
     body.search = searchinput? searchinput:this.state.searchinput;
     body.ordering = searchorder? searchorder:this.state.ordering;
     if (body.search && body.search.trim() && body.ordering && body.ordering.trim()) {
       $.ajax({
             url: '/api/search',
             dataType: 'json',
             cache: false,
             type: 'get',
             data: body,
             success: function(data) {
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
