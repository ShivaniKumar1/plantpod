import React, { Component } from 'react';
import { Router, Switch, Route } from "react-router-dom";

import Landing from './component/Landing/Landing';
import Login from './component/Login/Login';
import Signup from './component/Signup/Signup';
import Dashboard from './component/Dashboard/Dashboard';
import PlantInfo from './component/PlantInfo/PlantInfo';

import AuthHelper from './component/util/AuthHelper';
import history from './component/history/history';

class App extends Component {
    render() {
        return (
            <Router history = { history }>
                <Switch>
                    <Route path = "/" exact component = { Landing } />
                    <Route path = "/Login" component = { Login } />
                    <Route path = "/Signup" component = { Signup } />
                    <Route path = "/Dashboard" render = { props => <AuthHelper><Dashboard/></AuthHelper>} />
                    <Route path = "/PlantInfo" render = { props => <AuthHelper><PlantInfo/></AuthHelper>} />
                </Switch>
            </Router>
        );
    }
}

export default App;
