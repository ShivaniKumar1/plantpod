import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import './PlantInfo.css';

export default function Child({cardData, hideCard}) {
    return (
        <Container>
          <Row>
            <Col><img src="https://via.placeholder.com/140x100" alt="Plant Image"></img></Col>
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
                            <th className="nameCol">CO2_Level</th>
                            <th className="dataCol">{cardData.co2_level}</th>
                        </tr>
                    </tbody>
                </table>
            </Col>
            <Col xs={6}>Note Box Here</Col>
          </Row>
          <Row>
            <Col><Button primary onClick={() => hideCard()}>Return</Button></Col>
            <Col>Save Note. Delete Note. Undo Changes</Col>
          </Row>
        </Container>
    )
}
