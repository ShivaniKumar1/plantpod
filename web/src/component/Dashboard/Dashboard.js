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
                <Col>
                  <div className="header">
                    Welcome back {getUserInfo().username}
                  </div>
                </Col>
                <div class='lineBreak'/>
              </Row>
              <Row>
                <div className="header">Your Latest Note</div>
                <div class='lineBreak'/>
                <textarea value={latestNote.note}></textarea>
              </Row>
            </Col>
            <Col>
              <div className="header">
                The Latest Data
              </div>
              <div class='lineBreak'/>
              <table>
                  <tbody>
                      <tr>
                          <th className="nameCol">ID</th>
                          <th className="dataCol">{latestPlantData.id}</th>
                          <th className="nameCol">Red Light</th>
                          <th className="dataCol">{latestPlantData.red_light}</th>
                      </tr>
                      <tr>
                          <th className="nameCol">Date</th>
                          <th className="dataCol">{latestPlantData.date}</th>
                          <th className="nameCol">Orange Light</th>
                          <th className="dataCol">{latestPlantData.orange_light}</th>
                      </tr>
                      <tr>
                          <th className="nameCol">Dissolved Solids</th>
                          <th className="dataCol">{latestPlantData.dissolved_solids}</th>
                          <th className="nameCol">Yellow Light</th>
                          <th className="dataCol">{latestPlantData.yellow_light}</th>
                      </tr>
                      <tr>
                          <th className="nameCol">Pressure</th>
                          <th className="dataCol">{latestPlantData.pressure}</th>
                          <th className="nameCol">Green Light</th>
                          <th className="dataCol">{latestPlantData.green_light}</th>
                      </tr>
                      <tr>
                          <th className="nameCol">Temperature</th>
                          <th className="dataCol">{latestPlantData.temperature}</th>
                          <th className="nameCol">Light Blue Light</th>
                          <th className="dataCol">{latestPlantData.light_blue_light}</th>
                      </tr>
                      <tr>
                          <th className="nameCol">Humidity</th>
                          <th className="dataCol">{latestPlantData.humidity}</th>
                          <th className="nameCol">Green Light</th>
                          <th className="dataCol">{latestPlantData.blue_light}</th>
                      </tr>
                      <tr>
                          <th className="nameCol">Leaves</th>
                          <th className="dataCol">{latestPlantData.number_of_leaves}</th>
                          <th className="nameCol">Purple Light</th>
                          <th className="dataCol">{latestPlantData.purple_light}</th>
                      </tr>
                  </tbody>
                </table>
            </Col>

            <Col>
              <div className="header">
                The Latest Image
              </div>
              <div class='lineBreak'/>
              <img src={latestPlantData.picture} alt="Latest Plant Image"/>
            </Col>
          </Row>
        </Container>
    </div>
  );
}
