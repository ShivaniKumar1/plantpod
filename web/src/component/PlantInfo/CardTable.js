import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import Draggable from 'react-draggable';
import { getToken, getUserInfo } from './../util/JWTHelper';
import history from './../history/history';

const env = require('./../../env/env.json');

async function getNote(plantID) {
    let body = {user_id: getUserInfo().id, plant_id: plantID };
    return await fetch(env.APIURL + '/notes/getUsersPlantNote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify(body)
    })
    .then(res => { if (res.status == 401) history.push('/Login'); return res.json() })
    .then(json => { return json;})
}

async function updateNote(note) {
    return await fetch(env.APIURL + '/notes/updateNote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify(note)
    })
    .then(res => { if (res.status == 401) history.push('/Login'); return res.json() })
    .then(json => { console.log(json);})
}

export default function CardTable({cardData, compareCard}) {
    const [hidden, setHidden] = useState({'visibility': 'visible'})
    const changeHidden = (visible) => {
      if (visible)
        setHidden({'visibility': 'visible'});
      else
        setHidden({'visibility': 'hidden'});
    }

    const [loadingData, setLoadingData] = useState(true);
    useEffect(() => {
        async function load() {
            var data = await getNote(cardData.id);
            setCurrentNote(data);
            setEditingNoteText(data.note)
            setLoadingData(false);
        }
        if (loadingData) { load(); }
    }, []);


    const [currentNote, setCurrentNote] = useState([]);
    const [editingNoteText, setEditingNoteText] = useState([]);
    const changeCurrentNoteText = (event) => {
      let newNote = currentNote;
      newNote.note = event.target.value;
      setCurrentNote(newNote);
      setEditingNoteText(event.target.value);
    }

    const colorData = (value) => {
      if (cardData.comparisonData)
        if (value < 0)
          return {color: "red"}
        else if (value > 0)
          return {color: "green"}
      return {color: "initial"}
    }
    return (
      <Draggable >
        <Container className="content" style={hidden}>
          <Row>
            <Col><Button primary onClick={() => compareCard(cardData)}>Compare</Button></Col>
          </Row>
          <Row>
            <Col><img src={cardData.picture} alt="Plant Image"></img></Col>
          </Row>
          <Row>
            <Col xs={6}>
                <table>
                    <tbody>
                        <tr>
                            <th className="nameCol">ID</th>
                            <th className="dataCol">{cardData.id}</th>
                        </tr>
                        <tr>
                            <th className="nameCol">Date</th>
                            <th className="dataCol">{cardData.date}</th>
                        </tr>
                        <tr>
                            <th className="nameCol">Dissolved Solids</th>
                            <th className="dataCol" style={colorData(cardData.dissolved_solids)}>{cardData.dissolved_solids}</th>
                        </tr>
                        <tr>
                            <th className="nameCol">Light Level</th>
                            <th className="dataCol" style={colorData(cardData.light_level)}>{cardData.light_level}</th>
                        </tr>
                        <tr>
                            <th className="nameCol">Pressure</th>
                            <th className="dataCol" style={colorData(cardData.pressure)}>{cardData.pressure}</th>
                        </tr>
                        <tr>
                            <th className="nameCol">Temperature</th>
                            <th className="dataCol" style={colorData(cardData.temperature)}>{cardData.temperature}</th>
                        </tr>
                        <tr>
                            <th className="nameCol">Humidity</th>
                            <th className="dataCol" style={colorData(cardData.humidity)}>{cardData.humidity}</th>
                        </tr>
                        <tr>
                            <th className="nameCol">Leaves</th>
                            <th className="dataCol" style={colorData(cardData.number_of_leaves)}>{cardData.number_of_leaves}</th>
                        </tr>
                    </tbody>
                </table>
            </Col>
            <Col md="auto">
              <textarea placeholder="Please select a note..." value={editingNoteText} onChange={changeCurrentNoteText}></textarea>
            </Col>
          </Row>
          <Row>
            <Col><Button primary onClick={() => changeHidden(false)}>Return</Button></Col>
            <Col><Button primary onClick={() => updateNote(currentNote)}>Save Note</Button></Col>
          </Row>
        </Container>
      </Draggable>
    )
}
