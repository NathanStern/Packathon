import React from 'react';
import "./assets/css/nucleo-icons.css";
import "./assets/css/blk-design-system-react.css";

import {
  Button,
  Table
} from "reactstrap";

function Trips() {
  return (
    <Table responsive>
    <thead>
        <tr>
            <th className="text-center">#</th>
            <th>Name</th>
            <th>Location</th>
            <th className="text-right">Boxes</th>
            <th className="text-right">Actions</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td className="text-center">1</td>
            <td>Andrew Mike</td>
            <td>Purdue</td>
            <td className="text-right">15</td>
            <td className="text-right">
                <Button className="btn-icon" color="info" size="sm">
                    <i className="fa fa-user"></i>
                </Button>{` `}
                <Button className="btn-icon" color="success" size="sm">
                    <i className="fa fa-edit"></i>
                </Button>{` `}
                <Button className="btn-icon" color="danger" size="sm">
                    <i className="fa fa-times" />
                </Button>
            </td>
        </tr>
        
    </tbody>
</Table>
  );
}

export default Trips;
