import React, { useState } from 'react';
import {BrowserRouter as Router, Switch, Link, Route} from 'react-router-dom';
import logo from './logo.svg';
import Login from './component/Login';
import Signup from './component/Signup';
import useToken from './componenet/useToken';
import './App.css';

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.token
}

function App() {
  const {token, setToken} = useToken();

  if(!token) {
    return <Login setToken={setToken}/>
  }
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
            <Route path="/login"><Login/></Route>
            <Route path="/signup"><Signup/></Route>
          </Switch>
        </header>
      </div>
    </Router>
  );
}

export default App;
