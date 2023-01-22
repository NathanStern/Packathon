import React, { useEffect, useState } from 'react';
import https from 'https';
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
import { useLocation } from 'react-router-dom';

function getItems(box_id: string, state: any, callback: Function) {
  axios.request({
    method: 'GET',
    url: `http://nathans-macbook-pro.local:3030/item/list?box_id=${box_id}`,
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
    callback(response.data.items);
  })
    .catch((err) => {
      console.log(err);
      alert(err.message);
    });
}

function createItem(itemName: string, box_id: string, qty: number, state: any, callback: Function) {
  axios.request({
    method: 'POST',
    url: `http://nathans-macbook-pro.local:3030/item/create`,
    headers: {
      'Application-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${state.access_token}`
    },
    data: {
      name: itemName,
      box_id: box_id,
      qty: qty
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

function removeItem(item_id: string, state: any, callback: Function) {
  axios.request({
    method: 'DELETE',
    url: `http://nathans-macbook-pro.local:3030/item/${item_id}`,
    headers: {
      'Application-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${state.access_token}`
    },
    httpsAgent: new https.Agent({
  })
  }).then((response) => {
    console.log(response.data);
    callback();
  }).catch((err) => {
    console.log(err);
    alert(err.message);
  });
}

function Box(props: any) {
  const [modalState, setModalState] = useState({ isOpen: false });
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemQty, setItemQty] = useState(0);
  const [boxId, setBoxId] = useState("");

  useEffect(() => {
    // get the search params object
    const params = new URLSearchParams(location.search);

    getItems(params.get('box_id') ?? "", props.appState, setItems);
    setBoxId(params.get('box_id') ?? "");
  }, []);

  return (
    <>
      <>
        <Navbar className="navbar-dark bg-primary">
          <Container>
            <span className="navbar-text">
              Within Box #
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
            <th>Item</th>
            <th>Quantity</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any, index: number) => {
            return (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td className="text-right">
                  <Button className="btn-icon" color="danger" size="md" onClick={(e) => {
                    e.preventDefault();
                    removeItem(item.id, props.appState, () => getItems(boxId, props.appState, setItems))
                  }}>
                    <i className="fa fa-times" />
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      <Modal isOpen={modalState.isOpen} toggle={() => setModalState({ isOpen: !modalState.isOpen })}>
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Add Item
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
                <Row>
                  <Col>
                    <Input type="text" placeholder="Item Name" onChange={(e) => {
                      e.preventDefault();
                      setItemName(e.target.value);
                    }} />
                  </Col>
                  <Col>
                    <Input type="number" placeholder="Quantity" onChange={(e) => {
                      e.preventDefault();
                      setItemQty(parseInt(e.target.value));
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
          <Button color="primary" onClick={(e) => {
            e.preventDefault();
            createItem(itemName, boxId, itemQty, props.appState, () => setModalState({ isOpen: !modalState.isOpen }));
            getItems(boxId, props.appState, setItems);
            window.location.reload();
          }}>
            Save changes
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Box;
