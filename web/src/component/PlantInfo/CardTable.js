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

async function updateNote(note, isNewNote) {
    if (isNewNote && (note.note === "" || note.note == undefined))
      return false;
    if (!isNewNote && (note.note === "" || note.note == undefined))
      return await deleteNote(note);
    if (isNewNote)
      return await createNote(note);

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


async function createNote(note) {
    return await fetch(env.APIURL + '/notes/newNote', {
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

async function deleteNote(note) {
    let body = { id: note.id };
    return await fetch(env.APIURL + '/notes/deleteNote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify(body)
    })
    .then(res => { if (res.status == 401) history.push('/Login'); return res.json() })
    .then(json => { console.log(json);})
}

async function getImage(plantID) {
    let body = {id: plantID };
    return await fetch(env.APIURL + '/plantData/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify(body)
    })
    .then(res => { if (res.status == 401) history.push('/Login'); return res.json() })
    .then(json => { return json.picture;})
}

export default function CardTable({cardData, compareCard}) {
    const [hidden, setHidden] = useState({'visibility': 'visible'})
    const changeHidden = (visible) => {
      if (visible)
        setHidden({'visibility': 'visible'});
      else
        setHidden({'visibility': 'hidden'});
    }

    const [isNewNote, setIsNewNote] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    useEffect(() => {
        async function load() {
            var data = await getNote(cardData.id);
            setCurrentNote(data);
            setEditingNoteText(data.note);
            if (data.note == undefined)
              setIsNewNote(true);

            setLoadingData(false);
        }
        if (loadingData) { load(); }
    }, []);


    const [currentNote, setCurrentNote] = useState([]);
    const [editingNoteText, setEditingNoteText] = useState([]);
    const changeCurrentNoteText = (event) => {
      let newNote = currentNote;
      newNote.note = event.target.value;
      newNote.user_id = getUserInfo().id;
      newNote.sensor_data_id = cardData.id;
      newNote.id = currentNote.id;
      console.log(newNote);
      setCurrentNote(newNote);
      setEditingNoteText(event.target.value);
    }

    const [picture, setPicture] = useState([]);
    const [loadingPicture, setLoadingPicture] = useState(true);
    useEffect(() => {
        async function loadPicture() {
            var picture = await getImage(cardData.id);
            setPicture(picture);


            setLoadingPicture(false);
        }
        if (loadingPicture) { loadPicture(); }
    }, []);

    const colorData = (value) => {
      if (cardData.comparisonData)
        if (value < 0)
          return {color: "red"}
        else if (value > 0)
          return {color: "green"}
      return {color: "initial"}
    }


    return (
      <Draggable>
        <Container className="content" style={hidden}>
          <Row>
            <Col><Button primary onClick={() => compareCard(cardData)}>Compare</Button></Col>
          </Row>
          <Row>
            <Col><img src={picture} alt="Plant Image"></img></Col>
          </Row>
          <Row>
            <Col xs={6}>
                <table>
                    <tbody>
                        <tr>
                            <th className="nameCol">ID</th>
                            <th className="dataCol">{cardData.id}</th>
                            <th className="nameCol">Red Light</th>
                            <th className="dataCol" style={colorData(cardData.red_light)}>{cardData.red_light}</th>
                        </tr>
                        <tr>
                            <th className="nameCol">Date</th>
                            <th className="dataCol">{cardData.date}</th>
                            <th className="nameCol">Orange Light</th>
                            <th className="dataCol" style={colorData(cardData.orange_light)}>{cardData.orange_light}</th>
                        </tr>
                        <tr>
                            <th className="nameCol">Dissolved Solids</th>
                            <th className="dataCol" style={colorData(cardData.dissolved_solids)}>{cardData.dissolved_solids}</th>
                            <th className="nameCol">Yellow Light</th>
                            <th className="dataCol" style={colorData(cardData.yellow_light)}>{cardData.yellow_light}</th>
                        </tr>
                        <tr>
                            <th className="nameCol">Pressure</th>
                            <th className="dataCol" style={colorData(cardData.pressure)}>{cardData.pressure}</th>
                            <th className="nameCol">Green Light</th>
                            <th className="dataCol" style={colorData(cardData.green_light)}>{cardData.green_light}</th>
                        </tr>
                        <tr>
                            <th className="nameCol">Temperature</th>
                            <th className="dataCol" style={colorData(cardData.temperature)}>{cardData.temperature}</th>
                            <th className="nameCol">Light Blue Light</th>
                            <th className="dataCol" style={colorData(cardData.light_blue_light)}>{cardData.light_blue_light}</th>
                        </tr>
                        <tr>
                            <th className="nameCol">Humidity</th>
                            <th className="dataCol" style={colorData(cardData.humidity)}>{cardData.humidity}</th>
                            <th className="nameCol">Green Light</th>
                            <th className="dataCol" style={colorData(cardData.blue_light)}>{cardData.blue_light}</th>
                        </tr>
                        <tr>
                            <th className="nameCol">Leaves</th>
                            <th className="dataCol" style={colorData(cardData.number_of_leaves)}>{cardData.number_of_leaves}</th>
                            <th className="nameCol">Purple Light</th>
                            <th className="dataCol" style={colorData(cardData.purple_light)}>{cardData.purple_light}</th>
                        </tr>
                    </tbody>
                </table>
            </Col>
            <Col md="auto" style={{'margin-left': '40px'}}>
              <textarea style={{'font-size': '12pt', 'width':'100%','height':'100%'}} placeholder="Create a note!" value={editingNoteText} onChange={changeCurrentNoteText}></textarea>
            </Col>
          </Row>
          <Row>
            <Col><Button primary onClick={() => changeHidden(false)}>Return</Button></Col>
            <Col><Button primary onClick={() => updateNote(currentNote, isNewNote)}>Save Note</Button></Col>
          </Row>
        </Container>
      </Draggable>
    )
}
