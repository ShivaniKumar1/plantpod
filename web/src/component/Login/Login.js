import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { setToken, setUserInfo } from './../util/JWTHelper';
import history from './../history/history'

const env = require('./../../env/env.json');

async function loginUser(creds) {
    return fetch(env.APIURL + '/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(creds)
    })
    .then(data => data.json())

}

export default function Login() {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const tokenInfo = await loginUser({
            username: username,
            password: password
        });
        setToken(tokenInfo.token);
        setUserInfo({"username": tokenInfo.username, "id":tokenInfo.id });
        // Need to add a case if login fails
        history.push('/Dashboard');

    }

    return (
        <div className="loginform">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setUserName(e.target.value)}/>
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)}/>
                </label>
                <div className="button">
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}
