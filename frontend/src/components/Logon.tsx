import React from "react";
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


function handleLogin() {
  window.location.href = '/home'
}

function handleRegister() {
  window.location.href = '/register';
}

const Logon = (props: any) => {
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
          <FormGroup check>
            <Label check>
              <Input type="checkbox" />{' '}
              Remember Me
              <span className="form-check-sign">
                <span className="check"></span>
            </span>
            </Label>
          </FormGroup>
          <Button onClick={handleLogin} color="primary" type="submit">
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


