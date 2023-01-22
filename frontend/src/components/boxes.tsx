import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import https from 'https'
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

function getBoxes(room_id: string, state: any, callback: Function) {
    axios.request({
        method: 'GET',
        url: `https://nathans-macbook-pro.local:3030/box/list?room_id=${room_id}`,
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

function createBox(boxName: string, room_id: string, state: any, callback: Function) {
    axios.request({
        method: 'POST',
        url: `https://nathans-macbook-pro.local:3030/box/create`,
        headers: {
            'Application-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${state.access_token}`
        },
        data: {
            name: boxName,
            room_id: room_id
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
        });
}

function Trip(props: any) {
    const [modalState, setModalState] = useState({ isOpen: false });
    const location = useLocation();
    const [boxes, setBoxes] = useState([]);
    const [boxName, setBoxName] = useState("");
    const [roomId, setRoomId] = useState("");

    useEffect(() => {
        // get the search params object
        const params = new URLSearchParams(location.search);

        getBoxes(params.get('room_id') ?? "", props.appState, setBoxes);
        setRoomId(params.get('room_id') ?? "");
    }, []);

    return (
        <>
            <>
                <Navbar className="navbar-dark bg-primary">
                    <Container>
                        <span className="navbar-text">
                            Boxes in Room: [REDACTED]
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
                    {boxes.map((box: any, index: number) => {
                        return (
                            <tr key={index}>
                                <td>{box.name}</td>
                                <td className="text-right">
                                    <Button className="btn-icon" color="success" size="md" onClick={(e) => {
                                        e.preventDefault();
                                        window.location.href = `/box?box_id=${box.id}`;
                                    }}>
                                        <i className="fa fa-edit"></i>
                                    </Button>{` `}
                                    <Button onClick={(e) => {
                                        e.preventDefault();
                                        window.location.href = `/qrpage?box_id=${box.id}`;
                                    }} className="btn-icon" color="info" size="md">
                                        <i className="fa fa-qrcode"></i>
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
                        Add Box
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
                                <Input type="text" placeholder="Box Name" onChange={(e) => {
                                    e.preventDefault();
                                    setBoxName(e.target.value);
                                }} />
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
                        createBox(boxName, roomId, props.appState, () => setModalState({ isOpen: !modalState.isOpen }));
                        getBoxes(roomId, props.appState, setBoxes);
                        window.location.reload();
                    }}>
                        Save changes
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default Trip;
