import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { setToken, setUserInfo } from './../util/JWTHelper';
import history from './../history/history'

const env = require('./../../env/env.json');


async function signupUser(info) {
    return fetch(env.APIURL + '/users/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
    })
    .then(data => data.json())

}

export default function Signup() {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();



    const handleSubmit = async e => {
      e.preventDefault();
      const newUser = await signupUser({
          username: username,
          password: password
      });
      alert('Signup Complete');

    }
      return (
          <div className="signup">
              <h2>Create an account below.</h2>
              <form className="form-wrapper" onSubmit={handleSubmit}>
                  <label className="label">
                      <p>First name</p>
                      <input type="fname" onChange={e => setFirstName(e.target.value)}/>
                  </label>
                  <label className="label">
                      <p>Last name</p>
                      <input type="lname" onChange={e => setLastName(e.target.value)}/>
                  </label>
                  <label className="label">
                      <p>Username</p>
                      <input type="username" onChange={e => setUsername(e.target.value)} />
                  </label>
                  <label className="label">
                      <p>Email</p>
                      <input type="email" onChange={e => setEmail(e.target.value)}/>
                  </label>
                  <label className="label">
                      <p>Password</p>
                      <input type="password" onChange={e => setPassword(e.target.value)}/>
                  </label>
                  <div className="submit">
                      <button className="submit">Submit</button>
                  </div>
              </form>
          </div>
      )
}
