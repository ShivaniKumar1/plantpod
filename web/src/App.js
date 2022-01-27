import React from 'react';
import logo from './logo.svg';
import Login from './component/Login';
import useToken from './component/useToken';
import './App.css';

export default function App() {
  const {token, setToken} = useToken();

  if(!token) {
    return <Login setToken={setToken}/>
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}
