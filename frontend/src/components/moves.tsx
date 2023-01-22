import React, { useState, useEffect } from 'react';
import "./../assets/css/nucleo-icons.css";
import "./../assets/css/blk-design-system-react.css";
import "./../assets/css/blk-design-system-react.css.map";
import "./../assets/css/blk-design-system-react.min.css";

import {
  Button,
  Container,
  Navbar,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  Input,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";
import axios from 'axios';

async function getUserProjects(state: any, callback: Function) {
  const projects = (await axios.request({
    method: 'get',
    url: 'http://localhost:3030/project/list',
    headers: {
      'Application-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${state.access_token}`
    }
  })).data.data;
  console.log(projects)
  callback(projects);
}

function createProject(projectName: string, state: any, callback: Function) {
  axios.request({
    method: 'post',
    url: 'http://localhost:3030/project/create',
    headers: {
      'Application-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${state.access_token}`
    },
    data: {
      name: projectName
    }
  }).then((response) => {
    console.log(response.data);
    callback();
  })
  .catch((err) => {
    console.log(err);
    alert(err.message);
  });
}

function allowlistUser(email: string, project_id: string, callback: Function) {
  axios.request({
    method: 'post',
    url: 'http://localhost:3030/project/add',
    headers: {
      'Application-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    },
    data: {
      email: email,
      project_id: project_id
    }
  }).then((response) => {
    console.log(response.data);
    callback();
  })
    .catch((err) => {
      console.log(err);
      alert(err.message);
    });
}

function Home(props: any) {
  const [modalState, setModalState] = useState({ isOpen: false });
  const [userModalState, setUserModalState] = useState({ isOpen: false });
  const [modalEmail, setModalEmail] = useState("");
  const [modalProjectId, setModalProjectId] = useState("");

  const [projectName, setProjectName] = useState("");

  const [projects, setProjects] = useState([]);

  // useEffect hook to run project get
  useEffect(() => {
    getUserProjects(props.appState, setProjects);
  }, []);

  return (
    <>
      <>
        <Navbar className="navbar-dark bg-primary">
          <Container>
            <span className="navbar-text">
              Welcome, These are your pending moves!
            </span>
          </Container>
          <Button onClick={() => {
            setModalState({ isOpen: !modalState.isOpen });
          }} className="btn-icon" color="success" size="md">
            <i className="fa fa-plus" />
          </Button>
        </Navbar>
      </>
      <Table responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Owner</th>
            {/* <th className="text-right">Boxes</th> */}
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            // map the projects array
            projects.map((project: any, index: number) => {
              return (
                <tr key={index}>
                  <td>{project.name}</td>
                  <td>{project.owner}</td>
                  <td className="text-right">
                    <Button className="btn-icon" color="success" size="md" id={`edit-${project.project_id}`} onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/room?id=${project.project_id}`;
                    }}>
                      <i className="fa fa-edit"></i>
                    </Button>{` `}
                    <UncontrolledTooltip placement="left" target={`edit-${project.project_id}`} delay={0}>
                      Edit Project
                    </UncontrolledTooltip>
                    <Button onClick={() => {
                      setUserModalState({ isOpen: !userModalState.isOpen });
                      setModalProjectId(project.project_id);
                    }} className="btn-icon" color="info" size="md">
                      <i className="fa fa-user"></i>
                    </Button>{` `}
                    <Button className="btn-icon" color="danger" size="md">
                      <i className="fa fa-times" />
                    </Button>
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </Table>
      <Modal isOpen={modalState.isOpen} toggle={() => setModalState({ isOpen: !modalState.isOpen })}>
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Add Move
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-hidden="true"
            onClick={() => setModalState({ isOpen: !modalState.isOpen })}
          >
            <i className="tim-icons icon-simple-remove" />
          </button>
        </div>
        <ModalBody color="primary">
          <Card>
            <CardBody>
              <form>
                <Row>
                  <Col>
                    <Input type="text" placeholder="Move Name" onChange={(e) => {
                      e.preventDefault()
                      setProjectName(e.target.value);
                    }} />
                  </Col>
                </Row>
              </form>
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalState({ isOpen: !modalState.isOpen })}>
            Close
          </Button>
          <Button color="primary" onSubmit={(e) => {e.preventDefault()}} onClick={(e) => {
            e.preventDefault();
            createProject(projectName, props.appState, () => setModalState({ isOpen: !modalState.isOpen }));
            window.location.reload();
          }}>
            Save changes
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={userModalState.isOpen} toggle={() => setUserModalState({ isOpen: !userModalState.isOpen })}>
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Add User
          </h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-hidden="true"
            onClick={() => setUserModalState({ isOpen: !userModalState.isOpen })}
          >
            <i className="tim-icons icon-simple-remove" />
          </button>
        </div>
        <ModalBody color="primary">
          <Card>
            <CardBody>
              <form>
                <Input type="text" placeholder="Email" onChange={(e) => {
                  e.preventDefault();
                  setModalEmail(e.target.value);
                }} />
              </form>
            </CardBody>
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setUserModalState({ isOpen: !userModalState.isOpen })}>
            Close
          </Button>
          <Button color="primary" onClick={(e) => {
            e.preventDefault();
            allowlistUser(modalEmail, modalProjectId, () => setUserModalState({ isOpen: !userModalState.isOpen }));
          }}>
            Add
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Home;
