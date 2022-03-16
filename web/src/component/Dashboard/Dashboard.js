import React, { useMemo, useState, useEffect } from 'react';
import { getToken, getUserInfo } from './../util/JWTHelper';
import { Container, Row, Col, Button } from 'react-bootstrap';

const env = require('./../../env/env.json');


async function getUserNotes() {
    return await fetch(env.APIURL + '/notes/getLatest', {
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

async function getLatestPlantData() {
    return await fetch(env.APIURL + '/plantdata/getLatest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        }
    })
    .then(res => res.json())
    .then(json => { console.log(json); return json;})
}

export default function Dash() {

    const [loadingData, setLoadingData] = useState(true);
    const [latestNote, setLatestNote] = useState([]);
    const [latestPlantData, setLatestPlantData] = useState([]);
    const [latestPicture, setLatestPicture] = useState([]);
    useEffect(() => {
        async function load() {
            var noteData = await getUserNotes();
            var plantData = await getLatestPlantData();
            console.log(noteData);
            console.log(plantData);

            setLatestNote(noteData);
            setLatestPlantData(plantData);
            console.log(plantData.picture.data);

            var binary = '';
            var bytes = [].slice.call(new Uint8Array(plantData.picture.data));
            bytes.forEach((b) => binary += String.fromCharCode(b));
            var fin = window.btoa(binary);

            console.log(fin);
            setLatestPicture("data:image/png;base64," + fin);
            setLoadingData(false);
        }
        if (loadingData) { load(); }
    }, []);

  return (
    <div className="content">
        <Container>
          <Row>
            <Col>
              <Row>
                <Col>Welcome back {getUserInfo().username}</Col>
                <Col md="auto"><Button>Logout</Button></Col>
              </Row>
              <Row>
                <textarea value={latestNote.note}></textarea>
              </Row>
            </Col>
            <Col>
                <table>
                    <tbody>
                        <tr>
                            <th className="nameCol">ID</th>
                            <th className="dataCol">{latestPlantData.id}</th>
                        </tr>
                        <tr>
                            <th className="nameCol">Date</th>
                            <th className="dataCol">{latestPlantData.date}</th>
                        </tr>
                        <tr>
                            <th className="nameCol">CO2_Level</th>
                            <th className="dataCol">{latestPlantData.co2_level}</th>
                        </tr>
                    </tbody>
                </table>
            </Col>

            <Col><img src={latestPicture} alt="Latest Plant Image"/></Col>
          </Row>
          <Row>
            <Col><Button>Placeholder</Button>Save Note. Delete Note. Undo Changes</Col>
            <Col></Col>
          </Row>
        </Container>
    </div>
  );
}
