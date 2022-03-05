import React, { useMemo, useState, useEffect } from 'react';
import { getToken, getUserInfo } from './../util/JWTHelper';
import { Container, Row, Col, Button } from 'react-bootstrap';
import CardTable from './../PlantInfo/CardTable.js';
import './Usernotes.css';

const env = require('./../../env/env.json');


async function getUserNotes() {
    return await fetch(env.APIURL + '/notes/getAll', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify(getUserInfo())
    })
    .then(res => res.json())
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
    .then(res => res.json())
    .then(json => { console.log(json);})
}

async function getPlantData(id) {
    return await fetch(env.APIURL + '/plantData/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify({ id: id })
    })
    .then(res => res.json())
    .then(json => { return json;})
}

export default function Usernotes() {

    const [loadingData, setLoadingData] = useState(true);
    const [notes, setNotes] = useState([]);
    useEffect(() => {
        async function load() {
            var noteData = await getUserNotes();
            console.log(noteData.data);
            setNotes(noteData.data);
            setLoadingData(false);
        }
        if (loadingData) { load(); }
    }, []);

    const [currentNote, setCurrentNote] = useState([]);
    const [editingNoteText, setEditingNoteText] = useState([]);
    const changeCurrentNote = (note) => {
      setCurrentNote(note);
      setEditingNoteText(note.note);
    }
    const changeCurrentNoteText = (event) => {

      let newNote = currentNote;
      newNote.note = event.target.value;
      setCurrentNote(newNote);
      setEditingNoteText(event.target.value);
    }

    const [sendCardData, setSendCardData] = useState([]);
    const [card1style, setCard1Style] = useState("hiddenCard1");
    const showCard1 = async (note) => {
      async function load() {
          var data = await getPlantData(note.sensor_data_id);
          console.log("trying to load plant data: " + data);
          setSendCardData(data);
          console.log("clicked");
          setCard1Style("revealedCard1");
      }
      await load();
    }
    const hideCard1 = () => {
        setCard1Style("hiddenCard1");
    }


    const contents = notes.map(note => {
          return <tr onClick={() => changeCurrentNote(note)} onDoubleClick={() => showCard1(note)} key={note.id}>
            <td>{note.date}</td>
            <td>{note.sensor_data_id}</td>
            <td>{note.note.substr(0, 30) + "..."}</td>
          </tr>
     })

     //note, change this table to a react-table table (need paging and sorting)
  return (
    <div className="content">
        <div id={card1style}>
            <CardTable cardData={sendCardData} hideCard={hideCard1}></CardTable>
        </div>
        <div>
            <Container>
              <Row>
                <Col>
                  <Row>
                    <Col>Welcome back {getUserInfo().username}</Col>
                    <Col md="auto"></Col>
                  </Row>
                  <Row>
                    <textarea placeholder="Please select a note..." value={editingNoteText} onChange={changeCurrentNoteText}></textarea>
                  </Row>
                  <Row>
                    <Button onClick={() => updateNote(currentNote)}>Save Changes</Button>
                  </Row>
                </Col>
                <Col>
                    <table>
                        <thead>
                            <tr>
                              <th>Date</th>
                              <th>Plant Data</th>
                              <th>Preview</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contents}
                        </tbody>
                    </table>
                </Col>
              </Row>
            </Container>
        </div>
    </div>
  );
}
