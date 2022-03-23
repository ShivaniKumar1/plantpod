import React, { useMemo, useState, useEffect } from 'react';
import { getToken, getUserInfo } from './../util/JWTHelper';
import { Container, Row, Col, Button } from 'react-bootstrap';
import history from './../history/history'
import homeImg from './homeImg.png';
const env = require('./../../env/env.json');

export default function Navbar() {
  return (
    <div className="Navbar">
        <Container fluid>
          <Row>
            <Col><Button className="navbutton" onClick={() => history.push('/Dashboard')}><img src={homeImg} width="30" height="30"/></Button></Col>
          </Row>
          <Row>
            <Col><Button className="navbutton" onClick={() => history.push('/Usernotes')}>User Notes</Button></Col>
          </Row>
          <Row>
            <Col><Button className="navbutton" onClick={() => history.push('/PlantInfo')}>Plant Data</Button></Col>
          </Row>
          <Row>
            <Col><Button className="navbutton" onClick={() => history.push('/Login')}>Logout</Button></Col>
          </Row>
        </Container>
    </div>
  );
}
