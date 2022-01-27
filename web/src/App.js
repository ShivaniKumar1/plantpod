import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Link, Route} from 'react-router-dom';
import logo from './logo.svg';
import Login from './component/Login';
import Dash from './component/Dash';
import Signup from './component/Signup';
import './App.css';

class App extends Component {
    render() {
        return (
            <Router>
            <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <ul className="nav">
                    <Link to="/login">Login</Link>
                    <br></br>
                    <Link to="/signup">Signup</Link>
                </ul>
                <Switch>
                    <Route path="/login"><Dash/></Route>
                    <Route path="/signup"><Signup/></Route>
                </Switch>
            </header>
        </div>
        </Router>
        );
    }
}

export default App;