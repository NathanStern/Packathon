import React, { useState } from "react";
import QrReader from "react-qr-reader";
import "./style.css";

export default function App() {
  const [result, setResult] = useState("No result");
  let handleScan = (data: any) => {
    if (data) {
      setResult(data);
    }
  };

  let handleError = (err: any) => {
    // alert(err);
  };
  return (
    <div>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
        facingMode="environment"
      />
      <p>{result}</p>
    </div>
  );
}
