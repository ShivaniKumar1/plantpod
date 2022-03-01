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
                <div>
                    <Button variant="btn btn-success" onClick={() => history.push('/Login')} >Login</Button><Button variant="btn btn-success" onClick={() => history.push('/Signup')} >Signup</Button>
                </div>
            </header>
        </div>
    )
}
