import React, { Component } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import SearchResults from './SearchResults';
import Users from './Users';
import { FaThumbsUp } from 'react-icons/fa';
import { css } from 'emotion'
import YouTube from 'react-youtube';


class Playlists extends Component {
  state = {
    playlists: [],
    searchTerm: '',
    options: [],
    results: [],
    isLoading: true,
    currentVideoId: '',
    videos: [],
    newVideos: [],
    creating: false,
  };

  _onReady(event) {
    event.target.seekTo(5)
    event.target.pauseVideo();
  }
  
  addToPlaylist = (video) => {
    let newVideo = {};
    newVideo.video_title = video.title;
    newVideo.video_url = 'https://www.youtube.com/watch?' + video.id;
    newVideo.playlistId = this.props.match.params.id ;
    newVideo.video_thumbnail = video.thumbnails.high.url;
    newVideo.duration = video.duration;
    newVideo.youtubeId = video.id;
    this.addtoList(newVideo);

  }

  formatDuration(duration){
    let firstIteration = duration.split('PT').join('').split('S').join('');
    let mSplit = firstIteration.split('M');
    let seconds = mSplit[mSplit.length-1] || '00';
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
  upVote(video){
    this.setState({
      currentVideoId: video.youtubeId
    });
  }
  addtoList = (video) => {
    this.setState({
      creating: true,
    });
    const { id } = this.props.match.params;
    const API_URL = `http://localhost:5000/api/v1/playlists/${id}/videos`;
    fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(video),
      headers: {
        'content-type': 'application/json'
      }
    }).then(res => res.json())
    .then(() => this.refresh())
  }
  refresh(){
    const { id } = this.props.match.params;
    const API_URL = `http://localhost:5000/api/v1/playlists/${id}/videos`;
    fetch(API_URL)
      .then(res => res.json())
      .then(videos => {
        setTimeout(() => {
          if (videos[0]) {
            this.setState({
              videos,
              currentVideoId: videos[0].youtubeId,
              isLoading: false
            });   
          } else {
            window.location.href = "http://localhost:3000/notfound"
          }
        }, 300);
      })
  }
  componentDidMount(){
    this.refresh()
  }
  searchingForVideo = (event) => {
    this.setState({
      searchTerm: event
    })
    if (event.trim()) {
      fetch(`http://localhost:5000/api/v1/videos/suggestion/${event}`)
      .then((req)=> req.json())
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
  submitted = (e) => {
    e.preventDefault();
    if (this.state.searchTerm.trim()) {
      fetch(`http://localhost:5000/api/v1/videos/search/${this.state.searchTerm}`)
      .then((req)=> req.json())
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

  render() {    
    const opts = {
      width: '100%',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };

    return (
    <div>
      <nav className="navbar" style={{ backgroundColor:"#008C8E", justifyContent:"center", marginBottom:"10px" }}>
          <form className="form-inline my-2 my-lg-0" onSubmit={this.submitted}>
            <Typeahead style={{ width: '300px'}} type="text" placeholder="Search" selectHintOnEnter={true} onInputChange={this.searchingForVideo} labelKey={option => `${option}`} options={this.state.options}/>
            <button className="btn btn-secondary my-2 my-sm-0" style={{marginLeft: "5px"}} type="submit">Search</button>
          </form>
      </nav>
      <div className="container">
        <div className="row">
          <div className="col-3"><Users/></div>
          <div className="col-6" style={{ justifyContent:"center" }}>
            { this.state.currentVideoId === '' ? <div id="loader"></div>:
              <div video-container>
                <YouTube 
                videoId={ this.state.currentVideoId }
                opts={ opts }
                onReady={ this._onReady }
                /> 
              </div>
            }
              <h1 style={{ color:"white" }}>Upcoming Songs:</h1>
            <div style={{ justifyContent: 'space-around', margin: '1px' }} className="row">
              { this.state.isLoading? <h2>Loading playlist... </h2>:
                  this.state.videos.map(video => (
                    <div style={{ display:'flex', justifyContent:'space-between', background:`URL('${video.video_thumbnail}')`, height:'120px', width:'215px', backgroundSize:'100%', borderColor:'black', marginBottom: '20px' }} key={video.id}>
                      <div style={{ justifyContent: 'space-between', height: 'auto', width: '100%', display: 'flex' }}>
                        <span style={{overflow:'hidden', whiteSpace: "nowrap", textOverflow: "clip", height:"min-content"}}>{ video.video_title }</span>
                        <div style={{ justifyContent: 'space-between', width: 'auto', display: 'flex', flexDirection: 'column' }}>
                          <span style={{backgroundColor:'black', paddingLeft:'10px', height:'20px', textAlign:'right'}}>{ this.formatDuration(video.duration)}</span>
                          <span style={{width: 'auto', paddingLeft:'10px', color:'white', textAlign:"right"}}>
                            <FaThumbsUp onClick={() => this.upVote(video)} className={css`color: white;opacity: 0.8;&:hover {color: #BEDE5C;opacity: 1}`} style={{ cursor:"pointer", textShadow: '1px 1px 1px #ccc' }}/> 
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>
          <div className="col-3" style={{justifyContent:"center"}}>
            {
              this.state.results.length > 0
              ? <SearchResults addToPlaylist = { this.addToPlaylist } results={this.state.results}/>
              : ''
            }
          </div>
        </div>
      </div>
    </div>
    )
  }
};

export default Playlists;