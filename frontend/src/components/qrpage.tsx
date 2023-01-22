import React from 'react';
import ReactDOM from 'react-dom'
import QRCode from 'react-qr-code';

import "./../assets/css/nucleo-icons.css";
import "./../assets/css/blk-design-system-react.css";
import "./../assets/css/blk-design-system-react.css.map";
import "./../assets/css/blk-design-system-react.min.css";
import { Button } from 'reactstrap';

function printButton() {
    window.print();
}

function Qrpage() {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <QRCode size={400} value="hey" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button color="success" onClick={printButton}>Print</Button>
            </div>
        </>
    );
}
export default Qrpage;