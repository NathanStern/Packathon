import React, { useState } from "react";
import QrReader from "react-qr-reader";
import "./style.css";

export default function App() {
  const [result, setResult] = useState("No result");
  let handleScan = (data: any) => {
    if (data) {
      setResult(data);
      window.location.href = data.replace("http://nathans-macbook-pro.local:3000", "");
    }
  };

  let handleError = (err: any) => {
    // alert(err);
  };
  return (
    <div>
      <QrReader
        delay={0}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "100%" }}
        facingMode="environment"
      />
      <p>{result}</p>
    </div>
  );
}