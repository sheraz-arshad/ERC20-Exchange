import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'font-awesome/css/font-awesome.min.css';
import 'font-awesome/css/font-awesome.min.css';

import Home from './Components/Home';

function App() {
  return (
    <div style={{ width: "100%", height: "100%"}}>
      <img src={require("./logo.png")} style={{margin: "20px", height: "45px", float: "left"}} />
      <i className="fa fa-info-circle fa-2x" style={{color: "white", margin: "20px", float: "right"}}></i>
      <Home />
    </div>
  );
}

export default App;
