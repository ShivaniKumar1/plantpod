import React from 'react';
import { getToken, getUserInfo } from './../util/JWTHelper';

const env = require('./../../env/env.json');


async function getUserNotes() {
    return await fetch(env.APIURL + '/notes/getAll', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify(getUserInfo())
    })
    .then(res => res.json())
    .then(json => { console.log(json); return json;})


}

export default function Dash() {

  return (
    <div className="Dash">
      <header className="Dash-header">
        // follow figma for main page https://www.figma.com/file/iYLyvDwOfiUjd4WHpIenxC/Plant-Pod-GUI-Draft?node-id=0%3A1
      </header>
    </div>
  );
}
