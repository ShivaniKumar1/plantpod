import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import logo from './plantlogo.png';
import history from './../history/history'
import './Landing.css';

export default function Landing({ setToken }) {
    return (
        <div className="landingPage">
            <header className="App-header">
                <p> Welcome PlantPod Team</p>
                <img src={logo} className="App-logo" alt="logo" />
                <Button variant="btn btn-success" onClick={() => history.push('/Login')} style={{color: '#7084a5'}} activeStyle={{color: '#acbcb2'}}>Login</Button>
                <br></br>
                <Button variant="btn btn-success" onClick={() => history.push('/Signup')} style={{color: '#7084a5'}} activeStyle={{color: '#acbcb2'}}>Signup</Button>
            </header>
        </div>
    )
}

//Login.propTypes = {
//    setToken: PropTypes.func.isRequired
//};
