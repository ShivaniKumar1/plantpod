import React from 'react';
import Login from './Login';
import useToken from './useToken';

export default function Dash() {
  const {token, setToken} = useToken();

  if(!token) {
    return <Login setToken={setToken}/>
  }

  return (
    <div className="Dash">
      <header className="Dash-header">
      </header>
    </div>
  );
}
