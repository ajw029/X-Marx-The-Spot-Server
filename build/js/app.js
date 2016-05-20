var React = require('react');
var render = require('react-dom');

var Router = require('react-router').Router
var Route = require('react-router').Route
var Link = require('react-router').Link

var browserHistory = require('react-router').browserHistory;

var HomeContainer = require('./app/Home.react');
var MostRecentComponent = require('./app/MostRecentComponent.react');
var MyFavComponent = require('./app/MyFavComponent.react');

var routes = (
    <Route name="app" path="/home2" handler={HomeContainer}>
      <Route name="login" path="/login" handler={MostRecentComponent}/>
    </Route>
);


render.render((
  <Router history={browserHistory}>
    <Route path="/home" component={HomeContainer}></Route>
    <Route path="/myfavlinks" component={MyFavComponent}></Route>
    <Route path="/myrecent" component={MostRecentComponent}></Route>
    <Route path="/addnewfolder" component={HomeContainer}></Route>
    <Route path="/gotosettings" component={HomeContainer}></Route>
  </Router>
), document.getElementById('myapp'))

/*
React.render(
  routes,
  document.getElementById('myapp')
);
*/
/*
ReactDOM.render(
  <HomeContainer/>,
  document.getElementById('myapp')
);
*/
