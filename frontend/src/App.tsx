import React, { useState } from 'react';
import {Routes, Route, Navigate} from 'react-router-dom'
import Logon from './components/Logon';
import Register from './components/Register';
import Home from './components/moves';
import Trip from './components/boxes';
import Box from './components/items';
import Qrpage from './components/qrpage';

import {
  Button,
  Table
} from "reactstrap";
import Room from './components/rooms';

function App(props: any) {
    const [state, setState] = useState({access_token: localStorage.getItem("access_token"), refresh_token: localStorage.getItem("refresh_token")});
  return (
  <Routes>
      <Route path="/login" element={<Logon {...props} appState={state} stateChanger={setState}/>}/>
      <Route path="/register" element={<Register {...props} appState={state}/>}/>
      <Route path="/home" element={<Home {...props} appState={state}/>}/>
      <Route path="/room" element={<Room {...props} appState={state}/>}/>
      <Route path="/trip" element={<Trip {...props} appState={state}/>}/>
      <Route path="/box" element={<Box {...props} appState={state}/>}/>
      <Route path="/qrpage" element={<Qrpage {...props} appState={state}/>}/>
  </Routes>
  );
}

export default App;
