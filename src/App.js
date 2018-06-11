import React, { Component } from 'react';

import './App.css';
let test = "test";
let defultTextColor = '#fff';
let defultStyle ={
  color: defultTextColor
};

class Aggregate extends Component {
  render() {
    return (
      <div style={{...defultStyle,width: "40%", display: 'inline-block'}}>
        <h2>Number Text</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={defultStyle}>
        <img src="" alt=""/>
        <input type="text"/> 
        Text
      </div>
    );
  }
}

class Playlist extends Component{
  render() {
    return (
      <div style={{...defultStyle, width: "30%",display: 'inline-block'}}>
        <img src="" alt=""/>
          <h3>playlist Name</h3>
          <ul>
          <li>Song 1</li> <li>Song 2</li> <li>Song 3</li>
          </ul>
      </div>
    );
  }
}

class App extends Component {

  render() {
    return (
      <div className="App">
      <h1>Title Part</h1>
        <Aggregate></Aggregate>
        <Aggregate></Aggregate>
        <Filter></Filter>
        <Playlist></Playlist>
        <Playlist></Playlist>
        <Playlist></Playlist>
      </div>
    );
  }
}

export default App;

