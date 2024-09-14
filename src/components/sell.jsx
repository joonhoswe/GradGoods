import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

const Home = () => (
  <div>
    <h1>Home Page</h1>
    <Link to="/about" className="text-lg text-gray-800">Go to About Page</Link>
  </div>
);

const About = () => (
  <div>
    <h1>About Page</h1>
    <Link to="/" className="text-lg text-gray-800">Go to Home Page</Link>
  </div>
);

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
    </Switch>
  </Router>
);

export default App;