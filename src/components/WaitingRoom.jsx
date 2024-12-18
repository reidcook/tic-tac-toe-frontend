import { useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";

const WaitingRoom = ({ joinGame }) => {
    const [username, setUsername] = useState();
    const [gameId, setGameId] = useState();

    return <Form onSubmit={ e => {
        e.preventDefault();
        joinGame(username, gameId);
    }}>
        <Row >
            <Col sm={2}></Col>
            <Col sm={8}>
                <hr />
                <Form.Group>
                    <Form.Control placeholder='Username' onChange={e => setUsername(e.target.value)}></Form.Control>
                    <Form.Control placeholder='Game Id' onChange={e => setGameId(e.target.value)}></Form.Control>
                </Form.Group>
            </Col>
            <Col sm={2}></Col>
            <Col sm={12}>
                <hr />
                <Button variant='success' type='submit'>Join</Button>
            </Col>
        </Row>

    </Form>
}

export default WaitingRoom