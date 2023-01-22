import React, { useState } from 'react';
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


function Box() {
    const [modalState, setModalState] = useState({isOpen: false});
    return (
        <>
            <>
                <Navbar className="navbar-dark bg-primary">
                    <Container>
                        <span className="navbar-text">
                            Within Box #
                        </span>
                    </Container>
                    <Button onClick={() => setModalState({isOpen: !modalState.isOpen})} className="btn-icon" color="success" size="md">
                        <i className="fa fa-plus" />
                    </Button>
                </Navbar>
            </>
            <Table responsive>
                <thead>
                    <tr>
                        <th className="text-center">#</th>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th className="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="text-center">1</td>
                        <td>Lamps</td>
                        <td>4</td>
                        <td className="text-right">
                            <Button className="btn-icon" color="danger" size="lg">
                                <i className="fa fa-times" />
                            </Button>
                        </td>
                    </tr>

                </tbody>
            </Table>
            <Modal isOpen={modalState.isOpen} toggle={() => setModalState({isOpen: !modalState.isOpen})}>
    <div className="modal-header">
      <h5 className="modal-title" id="exampleModalLabel">
        Add Item
      </h5>
      <button
        type="button"
        className="close"
        data-dismiss="modal"
        aria-hidden="true"
        onClick={() => setModalState({isOpen: !modalState.isOpen})}
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
                <Input type="text" placeholder="Item Name" />
              </Col>
              <Col>
                <Input type="number" placeholder="Quantity" />
              </Col>
            </Row>
          </form>
        </CardBody>
      </Card>
    </ModalBody>
    <ModalFooter>
        <Button color="secondary" onClick={() => setModalState({isOpen: !modalState.isOpen})}>
            Close
        </Button>
        <Button color="primary">
            Save changes
        </Button>
    </ModalFooter>
</Modal>
        </>
    );
}

export default Box;
