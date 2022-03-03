import React, { useMemo, useState, useEffect } from 'react';
import { getToken, getUserInfo } from './../util/JWTHelper';
import { Container, Row, Col, Button } from 'react-bootstrap';

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

export default function Dash() {

    const [loadingData, setLoadingData] = useState(true);
    const [notes, setNotes] = useState([]);
    useEffect(() => {
        async function load() {
            var noteData = await getUserNotes();
            console.log(noteData.data);
            setNotes(noteData.data);

            // you tell it that you had the result
            setLoadingData(false);
        }
        if (loadingData) { load(); }
    }, []);

    const contents = notes.map(note => {
          // change the title and location key based on your API
          return <tr>
            <td>{note.date}</td>
            <td>{note.sensor_data_id}</td>
            <td>{note.note.substr(0, 30) + "..."}</td>
          </tr>
     })

  return (
    <div className="Dash">
        <Container>
          <Row>
            <Col>
              <Row>
                <Col>Welcome back {getUserInfo().username}</Col>
                <Col md="auto"><Button>Logout</Button></Col>
              </Row>
              <Row>
                <textarea placeholder="Please select a note..."></textarea>
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
  );
}
