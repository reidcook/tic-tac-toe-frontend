import { useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";

const Login = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [register, setRegister] = useState(false);
    const [message, setMessage] = useState()

    const handleOnSubmit = async() => {
        if(register){
            try {
                await fetch("https://localhost:7162/register", {
                    method: 'POST',
                    body: JSON.stringify({
                        email: username+'@email.com',
                        password: password
                    }),
                    headers: {
                      'Content-type': 'application/json;',
                    },
                  })
                  .then((response) => console.log(response))
                await fetch("https://localhost:7162/User/"+username+'@email.com?' + new URLSearchParams({username: username}), {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json;',
                    },
                    })
                    .then((response) => {
                        if(response.ok){
                            setMessage("Register Successful")
                        }
                        console.log(response)
                })
            }
            catch(error) {
                console.log(error)
            }
        }
        else{
            await fetch("https://localhost:7162/login?useCookies=true", {
                method: 'POST',
                body: JSON.stringify({
                    email: username,
                    password: password
                }),
                credentials: 'include',
                headers: {
                  'Content-type': 'application/json;',
                  'accept': 'application/json'
                },
              })
              .then((response) => {
                if(response.ok){
                    props.setUsername(username);
                    props.setLoggedIn(true);
                }
              })
        }
    }

    return <Form onSubmit={ e => {
        e.preventDefault();
        // joinGame(props.username, gameId);
        handleOnSubmit()
    }}>
        <Row >
            <Col sm={2}></Col>
            <Col sm={8}>
                <hr />
                <Form.Group>
                    <Form.Control placeholder='Username' onChange={e => setUsername(e.target.value)}></Form.Control>
                    <Form.Control placeholder='Password' onChange={e => setPassword(e.target.value)}></Form.Control>
                    <div className="form-check form-switch" style={{textAlign: "left"}}>
                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={(e) => {setRegister(e.target.checked);}}/>
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault"><span style={{color: "white"}}>Register</span></label>
                    </div>
                </Form.Group>
            </Col>
            <Col sm={2}></Col>
            <Col sm={12}>
                <hr />
                <Button variant='success' type='submit'>{register ? "Register" : "Login"}</Button>
                <div style={{color: 'green'}}>{message}</div>
            </Col>
        </Row>

    </Form>
} 

export default Login