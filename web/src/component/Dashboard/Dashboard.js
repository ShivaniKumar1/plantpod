import React, { useMemo, useState, useEffect } from 'react';
import { getToken, getUserInfo } from './../util/JWTHelper';
import { Container, Row, Col, Button } from 'react-bootstrap';
import history from './../history/history';

const env = require('./../../env/env.json');


async function getLatestUserNote () {
    return await fetch(env.APIURL + '/notes/getLatest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify(getUserInfo())
    })
    .then(res => { if (res.status == 401) history.push('/Login'); return res.json() })
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
    .then(res => { if (res.status == 401) history.push('/Login'); return res.json() })
    .then(json => { console.log(json); return json;})
}

export default function Dash() {

    const [loadingData, setLoadingData] = useState(true);
    const [latestNote, setLatestNote] = useState([]);
    const [latestPlantData, setLatestPlantData] = useState([]);
    useEffect(() => {
        async function load() {
            var noteData = await getLatestUserNote();
            var plantData = await getLatestPlantData();

            setLatestNote(noteData);
            setLatestPlantData(plantData);

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
                Your Latest Note
                <textarea value={latestNote.note}></textarea>
              </Row>
            </Col>
            <Col>
                The Latest Data
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
                        <th className="nameCol">Dissolved Solids</th>
                        <th className="dataCol">{latestPlantData.dissolved_solids}</th>
                    </tr>
                    <tr>
                        <th className="nameCol">Light Level</th>
                        <th className="dataCol">{latestPlantData.light_level}</th>
                    </tr>
                    <tr>
                        <th className="nameCol">Pressure</th>
                        <th className="dataCol">{latestPlantData.pressure}</th>
                    </tr>
                    <tr>
                        <th className="nameCol">Temperature</th>
                        <th className="dataCol">{latestPlantData.temperature}</th>
                    </tr>
                    <tr>
                        <th className="nameCol">Humidity</th>
                        <th className="dataCol">{latestPlantData.humidity}</th>
                    </tr>
                    </tbody>
                </table>
            </Col>

            <Col>The Latest Image<br/><img src={latestPlantData.picture} alt="Latest Plant Image"/></Col>
          </Row>
        </Container>
    </div>
  );
}
