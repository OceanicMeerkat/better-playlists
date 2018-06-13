import React, { Component } from 'react';

import './App.css';

let defultTextColor = '#fff';
let defultStyle ={
  color: defultTextColor
};


let fakeServerData = {
  user: {
    name: 'Paichayon',
    playlist: [
      {
        name: 'Play List A',
        songs: [{name : 'Song A', duration: 1345}, {name : 'Song B', duration: 1050}, {name : 'Song C', duration: 1250}]
      },
      {
        name: 'Play List B',
        songs: [{name : 'Song O', duration: 1345}, {name : 'Song P', duration: 1050}, {name : 'Song E', duration: 1250}]
      },
      {
        name: 'Play List E',
        songs: [{name : 'Song Q', duration: 1345}, {name : 'Song Y', duration: 1050}, {name : 'Song E', duration: 1250}]
      },
      {       
        name: 'Play List O',
        songs: [{name : 'Song U', duration: 1345}, {name : 'Song D', duration: 1050}, {name : 'Song W', duration: 1250}]
      }
    ]
  }
}

class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{...defultStyle,width: "40%", display: 'inline-block'}}>
        <h2>{this.props.playlist.length} playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {

    let allSongs = this.props.playlist.reduce((songs, playlist) => {
      return songs.concat(playlist.songs);
    },[])
   let totalDuration = allSongs.reduce((sum, song) => {
      return sum + song.duration
   }, 0)
    return (
      <div style={{...defultStyle,width: "40%", display: 'inline-block'}}>
        <h2>{Math.round(totalDuration/60)} hours</h2>
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
  constructor(){
    super();
    this.state = {serverData:{}}
  }
  componentDidMount(){ 
    setTimeout(() =>{
    this.setState({serverData : fakeServerData});
  }, 1000);
  }

  render() {
    return (
      <div className="App">
      { this.state.serverData.user ? <div><h1 style={{...defultStyle, "font-size": "54px"}}>
        {this.state.serverData.user.name}'s Playlist
      </h1>
        
          <PlaylistCounter playlist={ this.state.serverData.user.playlist}></PlaylistCounter>
          <HoursCounter playlist={ this.state.serverData.user.playlist}></HoursCounter>
          
          
          <Filter></Filter>
          <Playlist></Playlist>
          <Playlist></Playlist>
          <Playlist></Playlist>
        </div> : <h1 style={defultStyle}>Loading...</h1>
      }
      </div>
    );
  }
}

export default App;

