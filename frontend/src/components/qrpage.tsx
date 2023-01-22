import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom'
import QRCode from 'react-qr-code';

import "./../assets/css/nucleo-icons.css";
import "./../assets/css/blk-design-system-react.css";
import "./../assets/css/blk-design-system-react.css.map";
import "./../assets/css/blk-design-system-react.min.css";
import { Button } from 'reactstrap';
import { useLocation } from 'react-router-dom';

function printButton() {
    window.print();
}

function Qrpage() {
    const location = useLocation();
    const [boxId, setBoxId] = useState('');

    useEffect(() => {
        // get the search params object
        const params = new URLSearchParams(location.search);

        // get the value of the query param
        const box_id = params.get('box_id');
        setBoxId(box_id?? "");
    }, []);

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', margin: '1rem' }}>
                <QRCode size={400} value={`http://nathans-macbook-pro.local:3000/box?box_id=${boxId}`} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button color="success" onClick={printButton}>Print</Button>
            </div>
        </>
    );
}
export default Qrpage;