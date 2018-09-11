import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Typeahead } from 'react-bootstrap-typeahead';
import { getSuggestions, createPlaylist, getVideoOptions, putVideosOnPlaylist } from '../API';
import SearchResults from './SearchResults';
import database from "../firebase";

class CreatePlaylist extends Component {
  state = {
    searchTerm: '',
    options: [],
    results: [],
    isLoading: true,
    videos:[],
    clickedId: 'tgbNymZ7vqY',
    playlists: [],
    playlist: [],
    playlistTitle: ''
  };
  searchingForVideo = (event) => {
    this.setState({
      searchTerm: event
    })
    if (event.trim()) {
      getSuggestions(`${event}`)
      .then((response) => {
        if (Array.isArray(response)) {
          let newOptions = response
          this.setState({
            options: newOptions,
          })
        }
      })
    }
  }
  playlistTitleChanged = (e) => {
    this.setState({
      playlistTitle: e.target.value,
    })
  }
  formatDuration(duration){
    let firstIteration = duration.split('PT').join('').split('S').join('');
    let mSplit = firstIteration.split('M');
    let seconds = mSplit[mSplit.length - 1 ] || '00';
    let hSplit = mSplit[0].split('H');
    let mins;
    let hours;
    if (hSplit.length === 2) {
      hours = hSplit[0]
      mins = hSplit[1]
    } else {
      hours = 0;
      mins = hSplit[0];
    }
    const pad = number => number.length === 1 ? '0' + number : number
    return `${pad(hours)}:${pad(mins)}:${pad(seconds)}`
  }
  createNewPlaylist = (e) => {
    e.preventDefault();
    console.log(this.state.playlistTitle)
    createPlaylist(this.state.playlistTitle)
    .then(playlist => {
      const playlistId = playlist.id
      Promise.all(this.state.videos.map(video => { 
        video.playlistId = playlist.id
        return putVideosOnPlaylist(playlistId, video)
      }))
      .then( () => {
        database.ref('/playlists/' + playlistId).set({
          currentTime: 0,
          currentVideoIndex: 0,
          isPlaying: true,
          creatorId: '',
          hostTime: Date.now(),
        }, (error) => {
          if (error) {
            console.log('error creating playlist');
          } else {
            this.props.history.push(`/playlists/${playlistId}`);
          }
        })
      })
    })
  }
  submitted = (e) => {
    e.preventDefault();
    if (this.state.searchTerm.trim()) {
      getVideoOptions(`${this.state.searchTerm}`)
      .then((response) => {
        if (Array.isArray(response.items)) {
          const snippets = response.items.map(item => ({
            ...item.snippet, 
            id: item.id,
            ...item.contentDetails
          }))
          this.setState({
            results: snippets,
          })
        } else {
          console.log("Invalid Search!")
        }
      })
    }
  }
  addToPlaylist = (video) => {    
    let newVideo = {};
    newVideo.video_title = video.title;
    newVideo.video_url = 'https://www.youtube.com/watch?' + video.id + 'rel=0' ;
    newVideo.video_thumbnail = video.thumbnails.high.url;
    newVideo.duration = video.duration;
    newVideo.youtubeId = video.id;
    this.addtoList(newVideo);
  }
  addtoList = (video) => {
    this.setState({
      creating: true,
    });
    this.putVideosOnNewPlaylist(video)
  }
  putVideosOnNewPlaylist = (video) => {
    this.setState({
      videos: [...this.state.videos, video]
    })
  }
  render(){
    return(
    <div>
      <div className="container alert" style={{ backgroundColor:"#138C8D"}} >
        <div className="col-12">
          <h4>Create A Playlist!</h4>
          <p><hr/>Add a name and choose your first few songs using the search bar above.<hr/> You can add more at any time once your playlist has been created!</p>
          </div>
        <div className="row">
          <div className="col">
            <form className="form-inline my-2 my-lg-0" onSubmit={this.submitted}>
              <Typeahead style={{ width: '300px'}} type="text" placeholder="Search" selectHintOnEnter={true} onInputChange={this.searchingForVideo} labelKey={option => `${option}`} options={this.state.options}/>
              <button className="btn btn-secondary my-2 my-sm-0" style={{marginLeft: "5px"}} type="submit">Search</button>
            </form>
          </div>
          <div className="col">
            <form onSubmit={ this.createNewPlaylist }>
              <div className="form-group">
                <input onChange={ this.playlistTitleChanged } /* pass into create playlist */ type="text" className="form-control" id="formGroupExampleInput" placeholder="Playlist Name" required/>
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
        <div className="row">
          <div className="col-7" style={{justifyContent:"center"}}>
            <h1 style={{ color:"white" }}>Playlist Videos:</h1>
                <div style={{ justifyContent: 'space-around', margin: '1px' }} className="row">
                  { this.state.videos.length === 0 ? <h2>Search and select some songs! </h2>:
                      this.state.videos.map(video => (
                        <div style={{ color:'white', display:'flex', justifyContent:'space-between', background:`URL('${video.video_thumbnail}')`, backgroundPosition:'center', height:'120px', width:'215px', backgroundSize:'100%', borderColor:'black', marginBottom: '20px' }} key={video.id}>
                          <div style={{ justifyContent: 'space-between', height: 'auto', width: '100%', display: 'flex' }}>
                            <span style={{ backgroundColor: "rgb(1,2,3,.6", overflow:'hidden', whiteSpace: "nowrap", textOverflow: "clip", height:"min-content"}}>{ video.video_title }</span>
                            <div style={{ justifyContent: 'space-between', width: 'auto', display: 'flex', flexDirection: 'column' }}>
                              <span style={{ backgroundColor: "rgb(1,2,3,.6", paddingLeft:'10px', height:'21px', textAlign:'right'}}>{ this.formatDuration(video.duration)}</span>
                              <span style={{width: 'auto', paddingLeft:'10px', color:'white', textAlign:"right"}}></span>
                            </div>
                          </div>
                        </div>
                      ))
                  }
                </div>
          </div>
          <div className="col-5" style={{justifyContent:"center"}}>
            {
              this.state.results.length > 0
              ? <SearchResults addToPlaylist = { this.addToPlaylist } results = {this.state.results}/>
              : ''
            }
          </div>
        </div>
      </div>
    </div>
    )
  }
};

export default withRouter(CreatePlaylist);