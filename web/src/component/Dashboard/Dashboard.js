import React from 'react';
import useToken from '../util/useToken';

export default function Dash() {
  const {token, setToken} = useToken();

  //if(!token) {
    //return <Login setToken={setToken}/>
  //}

  return (
    <div className="Dash">
      <header className="Dash-header">
      </header>
    </div>
  );
}
