import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Link, Route} from 'react-router-dom';
import logo from './component/plantlogo.png';
import Dash from './component/Dash';
import Signup from './component/Signup';
import './App.css';

class App extends Component {
    render() {
        return (
            <Router>
            <div className="App">
            <header className="App-header">
                <p> Welcome PlantPod Team</p>
                <img src={logo} className="App-logo" alt="logo" />
                    <Link to="/login" style={{color: '#7084a5'}} activeStyle={{color: '#acbcb2'}}>Login</Link>
                    <br></br>
                    <Link to="/signup" style={{color: '#7084a5'}} activeStyle={{color: '#acbcb2'}}>Signup</Link>
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