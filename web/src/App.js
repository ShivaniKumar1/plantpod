import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Link, Route} from 'react-router-dom';
import logo from './logo.svg';
import Login from './component/Login';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
            <ul className="nav">
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
            <Switch>
              <Route path="/login" element={<Login />}></Route>
            </Switch>
          </header>
        </div>
      </Router>
    );
  }
}

export default App;
