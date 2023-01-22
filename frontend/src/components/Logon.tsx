import React, { useState } from "react";
import https from 'https';
import "./../assets/css/nucleo-icons.css";
import "./../assets/css/blk-design-system-react.css";
import "./../assets/css/blk-design-system-react.css.map";
import "./../assets/css/blk-design-system-react.min.css";



import {
  FormGroup,
  Label,
  Input,
  FormText,
  Button,
  Card,
  CardBody
} from "reactstrap";
import axios from "axios";


function handleLogin(email: string, password: string, stateChanger: Function) {
  let body = {
    email: email,
    password: password
  }
  console.table(body);
  axios.request({
    method: 'post',
    url: 'http://nathans-macbook-pro.local:3030/oauth/authorize?response_type=token',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: {...body},
    httpsAgent: new https.Agent({
  })
  }).then((response) => {
    console.log(response.data.token);
    localStorage.setItem('access_token', response.data.token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    stateChanger({access_token: response.data.token, refresh_token: response.data.refresh_token});
    window.location.href = '/home'
  })
  .catch((err) => {
    console.log(err);
    alert("An error occurred");
  });
}

function handleRegister() {
  window.location.href = '/register';
}

const Logon = (props: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card>
      <CardBody>
        <form>
          <FormGroup>
            <Label for="exampleEmail">Email address</Label>
            <Input
              type="email"
              name="email"
              id="exampleEmail"
              placeholder="Enter email"
              onChange={(e) => {setEmail(e.target.value)}}
            />
            <FormText color="muted">
              We'll never share your email with anyone else.
            </FormText>
          </FormGroup>
          <FormGroup>
            <Label for="examplePassword">Password</Label>
            <Input
              type="password"
              name="password"
              id="examplePassword"
              placeholder="Password"
              autoComplete="off"
              onChange={(e) => {setPassword(e.target.value)}}
            />
          </FormGroup>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" />{' '}
              Remember Me
              <span className="form-check-sign">
                <span className="check"></span>
            </span>
            </Label>
          </FormGroup>
          <Button onClick={(e) => {e.preventDefault(); handleLogin(email, password, props.stateChanger)}} color="primary" type="submit">
            Log In
          </Button>
        </form>
        <Button onClick={handleRegister} color="primary">
            Register
          </Button>
      </CardBody>
    </Card>
  );
};

export default Logon;


