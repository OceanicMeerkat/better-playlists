import React, { Component } from 'react';
import queryString from "query-string";
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
        name: 'Fev Song',
        songs: [{name : 'Song A', duration: 1345}, {name : 'Song B', duration: 1050}, {name : 'Song C', duration: 1250}]
      },
      {
        name: 'Chill out',
        songs: [{name : 'Song O', duration: 1345}, {name : 'Song P', duration: 1050}, {name : 'Song E', duration: 1250}]
      },
      {
        name: 'Focus',
        songs: [{name : 'Song Q', duration: 1345}, {name : 'Song Y', duration: 1050}, {name : 'Song E', duration: 1250}]
      },
      {       
        name: 'Retro',
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
        <input type="text" onKeyDown={event => 
          this.props.onTextChange(event.target.value)}/> 

      </div>
    );
  }
}

class Playlist extends Component{
  render() {
    let playlist = this.props.playlist;
    return (
      
      <div style={{...defultStyle, width: "25%",display: 'inline-block'}}>
        <img src={playlist.imageUrl} style={{width: '100px'}}/>
          <h3>{playlist.name}</h3>
          <ul>
            {playlist.songs.map(song =>
              <li>{song.name}</li>
            )}
          </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      serverData:{},
      filterString: ""
    }
  }
  componentDidMount(){ 
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
  
    if (!accessToken) {
      return;
    }

    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    })
    .then(res=> res.json())
    .then(data => this.setState({
      
        user:{
          name: data.display_name}
        }
      )
    );

    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    })
    .then(res=> res.json())
    .then(data => this.setState(
        {playlist: 
          data.items.map(item =>{ 
            console.log(data.items);
            return {
              name: item.name,
              imageUrl: item.images[0].url,
              songs:[]
            }
          
          }
          )
      }
    
    ));
  }

  render() {
    let playlistToRender = 
    this.state.user && 
    this.state.playlist 
      ? this.state.playlist.filter(playlist => 
      playlist.name.toLowerCase().includes(
        this.state.filterString.toLocaleLowerCase())
    ) : []
    return (
      <div className="App">
      { this.state.user ? <div><h1 style={{...defultStyle, fontSize: "54px"}}>
        {this.state.user.name} Playlist
      </h1>
    
          <PlaylistCounter playlist={ playlistToRender}></PlaylistCounter>
          <HoursCounter playlist={ playlistToRender}></HoursCounter>
          
          
          <Filter onTextChange={text => this.setState({filterString:text})}></Filter>
          {playlistToRender.map(playlist => 
           <Playlist playlist={playlist}/>
          )}
     
        
        </div> : <button onClick={()=> 
          {window.location= window.location.href.includes('localhost') 
          ? 'http://localhost:8888/login'
          : 'https://better-playlists-backend-pai.herokuapp.com/login'}
        }
        style={{padding:'20px', fontSize: '50px', marginTop:'20px'}}>Sign in with Spotify</button>
      }
      </div>
    );
  }
}

export default App;

