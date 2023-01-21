import React from "react";
import "./assets/css/nucleo-icons.css";
import "./assets/css/blk-design-system-react.css";

import {
  FormGroup,
  Label,
  Input,
  FormText,
  Button,
  Card,
  CardBody
} from "reactstrap";

const Register = () => {
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
                  />
              </FormGroup>
              <FormGroup>
                <Label for="exampleEmail">Email address</Label>
                <Input
                  type="email"
                  name="email"
                  id="exampleEmail"
                  placeholder="Enter email"
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
                />
              </FormGroup>
              
              <Button color="primary" type="submit">
                Register
              </Button>
            </form>
          </CardBody>
        </Card>
  );
};

export default Register;
