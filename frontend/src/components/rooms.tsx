import React, { useState, useEffect } from 'react';
import https from 'https';
import { useLocation } from 'react-router-dom';
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
    Col
} from "reactstrap";
import axios from 'axios';


function handleQR() {
    window.location.href = '/qrpage'
}

function getRooms(project_id: string, state: any, callback: Function) {
    axios.request({
        method: 'GET',
        url: `https://nathans-macbook-pro.local:3030/room/list?project_id=${project_id}`,
        headers: {
            'Application-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${state.access_token}`
        },
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        })
    }).then((response) => {
        console.log(response.data);
        callback(response.data.data);
    })
        .catch((err) => {
            console.log(err);
            alert(err.message);
        });
}

function createRoom(roomName: string, project_id: string, state: any, callback: Function) {
    axios.request({
        method: 'POST',
        url: `https://nathans-macbook-pro.local:3030/room/create`,
        headers: {
            'Application-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${state.access_token}`
        },
        data: {
            name: roomName,
            project_id: project_id
        },
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        })
    }).then((response) => {
        console.log(response.data);
        callback();
    })
    .catch((err) => {
        console.log(err);
        alert(err.message);
    })
}

function Room(props: any) {
    const [modalState, setModalState] = useState({ isOpen: false });

    const location = useLocation();
    const [rooms, setRooms] = useState([]);
    const [roomName, setRoomName] = useState("");
    const [projectId, setProjectId] = useState("");

    useEffect(() => {
        // get the search params object
        const params = new URLSearchParams(location.search);

        getRooms(params.get('id')?? "", props.appState, setRooms);
        setProjectId(params.get('id')?? "");
    }, []);

        return (
            <>
                <>
                    <Navbar className="navbar-dark bg-primary">
                        <Container>
                            <span className="navbar-text">
                                For The Move to [REDACTED]
                            </span>
                        </Container>
                        <Button onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/qrscan`;
                    }} className="btn-icon" color="info" size="md">
                        <i className="fa fa-qrcode"></i>
                    </Button>{` `}
                        <Button onClick={() => setModalState({ isOpen: !modalState.isOpen })} className="btn-icon" color="success" size="md">
                            <i className="fa fa-plus" />
                        </Button>
                    </Navbar>
                </>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Location</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rooms.map((room: any, index: number) => {
                            return (
                                <tr key={index}>
                                    <td>{room.name}</td>
                                    <td className="text-right">
                                        <Button className="btn-icon" color="success" size="md" onClick={(e) => {
                                            e.preventDefault();
                                            window.location.href = `/trip?room_id=${room.id}`;
                                        }}>
                                            <i className="fa fa-edit"></i>
                                        </Button>{` `}
                                        <Button className="btn-icon" color="danger" size="md">
                                            <i className="fa fa-times" />
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                <Modal isOpen={modalState.isOpen} toggle={() => setModalState({ isOpen: !modalState.isOpen })}>
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            Add Room
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
                    <ModalBody>
                        <Card>
                            <CardBody>
                                <form>
                                    <Input type="text" placeholder="Room Name" onChange={(e) => {
                                        e.preventDefault();
                                        setRoomName(e.target.value);
                                    }}/>
                                </form>
                            </CardBody>
                        </Card>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => setModalState({ isOpen: !modalState.isOpen })}>
                            Close
                        </Button>
                        <Button color="primary" onClick={(e) => {
                            e.preventDefault();
                            createRoom(roomName, projectId, props.appState, () => setModalState({ isOpen: !modalState.isOpen }));
                            getRooms(projectId, props.appState, setRooms);
                            window.location.reload();
                        }}>
                            Save changes
                        </Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }

export default Room;
