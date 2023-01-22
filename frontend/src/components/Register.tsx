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

async function handleRegister(username: string, email: string, password: string, confirmPassword: string) {
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }
  axios.request({
    method: 'post',
    url: 'https://nathans-macbook-pro.local:3030/user/create',
    headers: {
      'Application-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: {
      username: username,
      email: email,
      password: password
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
  })
  }).then((response) => {
    console.log(response);
    window.location.href = '/';
  })
  .catch((err) => {
    console.log(err);
    alert(err.message);
  });
}

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  return (
        <Card>
          <CardBody>
            <form>
              <FormGroup>
                <Label for="uname">Username</Label>
                <Input
                  type="text"
                  name="username"
                  id="uname"
                  placeholder="Select Username"
                  onChange={(e) => {setUsername(e.target.value)}}
                  />
              </FormGroup>
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
              <FormGroup>
                <Label for="confirmPassword">ConfirmPassword</Label>
                <Input
                  type="password"
                  name="password"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  autoComplete="off"
                  onChange={(e) => {setVerifyPassword(e.target.value)}}
                />
              </FormGroup>
              
              <Button color="primary" type="submit" onClick={(e) => {
                e.preventDefault();
                handleRegister(username, email, password, verifyPassword);
              }}>
                Register
              </Button>
            </form>
          </CardBody>
        </Card>
  );
};

export default Register;
