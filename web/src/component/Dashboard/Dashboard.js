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
    useEffect(() => {
        async function load() {
            var noteData = await getUserNotes();
            var plantData = await getLatestPlantData();
            console.log(noteData);
            console.log(plantData);
            setLatestNote(noteData);
            setLatestPlantData(plantData);

            // you tell it that you had the result
            setLoadingData(false);
        }
        if (loadingData) { load(); }
    }, []);

  return (
    <div className="Dash">
        <Container>
          <Row>
            <Col>
              <Row>UserName/logout here</Row>
              <Row>
              <input
                  type="text"
                  value={latestNote.note}
                  id="latestUserNoteBox"
                />
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

            <Col><img src="https://via.placeholder.com/140x100" alt="Plant Image"></img></Col>
          </Row>
          <Row>
            <Col><Button>Placeholder</Button>Save Note. Delete Note. Undo Changes</Col>
            <Col></Col>
          </Row>
        </Container>
    </div>
  );
}
