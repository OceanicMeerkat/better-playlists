import React, { Component } from 'react';
import queryString from "query-string";
import './App.css';

let defultTextColor = '#fff';
let defultStyle ={
  color: defultTextColor
};



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
        <img src={playlist.imageUrl} style={{width: '100px'}} alt=""/>
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
    .then(playlistData => {
      let playlists = playlistData.items
      let trackDataPromises =  playlists.map(playlist => {
        let responsePromise = 
        fetch(playlist.tracks.href, {
          headers: {'Authorization': 'Bearer ' + accessToken}
        });
        
        let trackDataPromises = responsePromise.then(res => res.json());
        return trackDataPromises;
      });

      let allTrackDataPromises =Promise.all(trackDataPromises)

      let playlistsPromise = allTrackDataPromises
      .then(trackDatas => {
        trackDatas.forEach((trackData,i) => {
          playlists[i].trackDatas = trackData.items
          .map(item => item.track)
          .map(trackData => ({
            name: trackData.name,
            duration: trackData.duration_ms/1000
          }));
        });
        return playlists;
      });
      return playlistsPromise;
    })
    .then(playlists => this.setState(
        {playlist: 
          playlists.map(item =>{ 
            
            return {
              name: item.name,
              imageUrl: item.images[0].url,
              songs: item.trackDatas.slice(0,5)
            }
          
          })
      }));
  }

  render() {
    let playlistToRender = 
    this.state.user && 
    this.state.playlist 
      ? this.state.playlist.filter(playlist =>{ 
        let matchesPlaylist = playlist.name.toLowerCase().includes(
          this.state.filterString.toLocaleLowerCase());

        let matchesSong = playlist.songs.find(song => song.name.toLowerCase().includes(this.state.filterString.toLowerCase()));


        return matchesPlaylist || matchesSong; 
      }) : []
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

