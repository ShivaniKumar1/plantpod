import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
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
          <div className="Signup">
              <h2>Create an account below</h2>
              <br></br>
              <form className="form-wrapper" onSubmit={handleSubmit}>
                  <label className="label">First Name:
                      <input type="fname" onChange={e => setFirstName(e.target.value)}/>
                  </label>
                  <label className="label">Last Name:
                      <input type="lname" onChange={e => setLastName(e.target.value)}/>
                  </label>
                  <label className="label">Username:
                      <input type="username" onChange={e => setUsername(e.target.value)} />
                  </label>
                  <label className="label">Email:
                      <input type="email" onChange={e => setEmail(e.target.value)}/>
                  </label>
                  <label className="label">Password:
                      <input type="password" onChange={e => setPassword(e.target.value)}/>
                  </label>
                  <div className="submit">
                      <button className="submit">Submit</button>
                  </div>
                  <Button className="signupbutton" onClick={() => history.push('/Login')}>Go to Login →</Button>
              </form>
          </div>
      )
}
