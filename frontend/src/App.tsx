import React, { useState } from 'react';
import {Routes, Route, Navigate} from 'react-router-dom'
import Logon from './components/logon';
import Register from './components/register';
import Home from './components/moves';
import Trip from './components/boxes';
import Box from './components/items';
import Qrpage from './components/qrpage';

import {
  Button,
  Table
} from "reactstrap";

function App(props: any) {
    const [state, setState] = useState({});
  return (
  <Routes>
      <Route path="/login" element={<Logon {...props} appState={state}/>}/>
      <Route path="/register" element={<Register {...props} appState={state}/>}/>
      <Route path="/home" element={<Home {...props} appState={state}/>}/>
      <Route path="/trip" element={<Trip {...props} appState={state}/>}/>
      <Route path="/box" element={<Box {...props} appState={state}/>}/>
      <Route path="/qrpage" element={<Qrpage {...props} appState={state}/>}/>
  </Routes>
  );
}

export default App;
