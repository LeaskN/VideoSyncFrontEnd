import React, { Component } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import SearchResults from './SearchResults';
import { FaThumbsUp } from 'react-icons/fa';
import { css } from 'emotion'
import YouTube from 'react-youtube';
import database from "../firebase";
import * as firebase from 'firebase';
import { getSuggestions, getVideoOptions, putVideosOnPlaylist, getVideosByPlaylist } from '../API';

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
    playlistData: {
      currentTime: 0,
      currentVideoIndex: -1,
      isPlaying: false,
      hostTime: Date.now(),
    },
    done: false,
    playlistOwner: false,
  };
  setVideoState = () => {
    if (this.videoPlayer) {
      if (!this.state.playlistData.isPlaying) {
        this.videoPlayer.pauseVideo();
      } else {
        this.videoPlayer.playVideo();
      }
      const videoTime = this.state.playlistData.currentTime;
      const differenceFromHost = (Date.now() - this.state.playlistData.hostTime)/1000;
      const expectedTime = videoTime + differenceFromHost;
      const differenceFromRealTime = this.videoPlayer.getCurrentTime() - expectedTime;
      console.log('Difference:', differenceFromRealTime);
      console.log(this.videoPlayer.getPlayerState());
      if (Math.abs(differenceFromRealTime) > 0.06) {
        console.log('seeking to: ', expectedTime + .3);
        this.videoPlayer.seekTo(expectedTime + .3);
      } 
    }
  }
  _onReady(event) {
    this.videoPlayer = event.target;
    this.setVideoState();
    this.updateCurrentTime();
  }
  _onStateChange(event){
    if (this.videoPlayer === null) {
      this.videoPlayer = event.target;
      this.updateCurrentTime();
    }
  }
  nextVideo = () => {
    if(this.state.playlistOwner){
      const { id } = this.props.match.params;
      if(this.state.playlistData.currentVideoIndex >= this.state.videos.length - 1){
        this.videoPlayer = null;
        database.ref('/playlists/' + id).set({
          ...this.state.playlistData,
          creatorId: this._user.uid,
          currentTime: 0,
          isPlaying: true,
          currentVideoIndex: 0,
          hostTime: Date.now(),
        });
        this.setState({
          currentVideoId: ''
        }, () => {
          this.setState({
            currentVideoId: this.state.videos[0].youtubeId,
            playlistData: {
              ...this.state.playlistData,
              creatorId: this._user.uid,
              currentTime: 0,
              isPlaying: true,
              currentVideoIndex: 0,
              hostTime: Date.now(),
            }
          })
        })
      } else {
        this.videoPlayer = null;
        database.ref('/playlists/' + id).set({
          ...this.state.playlistData,
          creatorId: this._user.uid,
          currentTime: 0,
          isPlaying: true,
          currentVideoIndex: this.state.playlistData.currentVideoIndex + 1,
          hostTime: Date.now(),
        });
        this.setState({
          currentVideoId: '',
        }, () => {
          this.setState({
            currentVideoId: this.state.videos[this.state.playlistData.currentVideoIndex + 1].youtubeId,
            playlistData: {
              ...this.state.playlistData,
              creatorId: this._user.uid,
              currentTime: 0,
              isPlaying: true,
              currentVideoIndex: this.state.playlistData.currentVideoIndex + 1,
              hostTime: Date.now(),
            }
          })
        })
      }
    }
  }
  addToPlaylist = (video) => {
    let newVideo = {};
    newVideo.video_title = video.title;
    newVideo.video_url = 'https://www.youtube.com/watch?' + video.id + 'rel=0' ;
    newVideo.playlistId = this.props.match.params.id ;
    newVideo.video_thumbnail = video.thumbnails.high.url;
    newVideo.duration = video.duration;
    newVideo.youtubeId = video.id;
    this.addtoList(newVideo);
  }
  async componentDidMount(){
    const { id } = this.props.match.params;
    await this.refresh()
    firebase.auth().signInAnonymously().catch(function(error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert('Error Code:', `${errorCode}`, `${errorMessage}`)
    });
    firebase.auth().onAuthStateChanged( user => {
      if(user){
        this._user = user;
        database.ref('/playlists/' + id).once('value').then( snapshot => {
          const playlistData = snapshot.val();
          if (!playlistData || !playlistData.creatorId || playlistData.creatorId === ''){
            database.ref('/playlists/' + id).set({
              currentTime: 0,
              currentVideoIndex: 0,
              isPlaying: true,
              creatorId: user.uid,
              hostTime: Date.now(),
            });
            this.setState({
              playlistOwner: true
            });
            this.setVideoState();
          } else if (playlistData.creatorId === user.uid) {
            database.ref('/playlists/' + id).set({
              currentTime: 0,
              currentVideoIndex: 0,
              isPlaying: true,
              creatorId: user.uid,
              hostTime: Date.now(),
            });
            this.setState({
              playlistOwner: true,
              playlistData: {
                currentTime: 0,
                currentVideoIndex: 0,
                isPlaying: true,
                hostTime: Date.now(),
              }
            });
            this.setVideoState();
          } else {
            database.ref('/playlists/' + id).on('value', (snapshot) => {
              const playlistData = snapshot.val();   
              if (!this.state.videos[playlistData.currentVideoIndex]) {
                this.setState({
                  playlistData,
                  currentVideoId: 0
                }, () => {
                  this.setVideoState();
                })
              } else {
                this.setState({
                  playlistData,
                  currentVideoId: this.state.videos[playlistData.currentVideoIndex].youtubeId
                }, () => {
                  this.setVideoState();
                })
              }
            });
          }
          console.log(this.state.playlistOwner);
        })
      }
    });
  }
  upVote(video){
    this.setState({
      currentVideoId: video.youtubeId
    });
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
  updateCurrentTime = () => {
    const { id } = this.props.match.params;
    if (this.videoPlayer) {
      if (this.state.playlistData.currentVideoIndex !== -1 && this.videoPlayer.getCurrentTime() !== 0 && this.state.playlistOwner) {
        database.ref('/playlists/' + id).set({
          ...this.state.playlistData,
          currentTime: this.videoPlayer.getCurrentTime(),
          isPlaying: this.videoPlayer.getPlayerState() === 1 || this.videoPlayer.getPlayerState() === 3,
          hostTime: Date.now(),
        });
      }
      setTimeout(() => {
        this.updateCurrentTime();
      }, 1000);
    }
  }
  addtoList = (video) => {
    this.setState({
      creating: true,
    });
    const { id } = this.props.match.params;
    putVideosOnPlaylist(id, video)
    .then(() => this.refresh(false))
  }
  refresh(firstLoad = true){
    const { id } = this.props.match.params;
    getVideosByPlaylist(id)
      .then(videos => {
          if (videos[0]) {
            this.setState({
              videos,
              currentVideoId: firstLoad ? videos[0].youtubeId : this.state.currentVideoId,
              isLoading: false
            });   
          } else {
            window.location.href = 'https://videosink.herokuapp.com/notfound' || "http://localhost:3000/notfound"
          }
      })
  }
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
  render() {    
    const opts = {
      width: '100%',
      playerVars: {
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
            <div className="col-md-10 offset-md-1" style={{ justifyContent:"center" }}>
              { this.state.currentVideoId === '' ? <div id="loader"></div>:
                <div className="video-container">
                  <YouTube 
                  videoId={ this.state.currentVideoId }
                  opts={ opts }
                  onReady={ this._onReady.bind(this) }
                  onEnd={ this.nextVideo.bind(this) }
                  onStateChange={ this._onStateChange.bind(this) }
                  /> 
                </div>
              }
            </div>
            <div className={this.state.results.length === 0 ? "col-12" : "col-9"}>
              <h1 style={{ color:"white" }}>Upcoming Videos:</h1>
              <div style={{ justifyContent: 'space-around', margin: '1px' }} className="row">
                { this.state.isLoading ? <h2>Loading playlist... </h2>:
                    this.state.videos.map(video => (
                      <div style={{ color:'white', display:'flex', justifyContent:'space-between', background:`URL('${video.video_thumbnail}')`, backgroundPosition:'center', height:'120px', width:'200px', backgroundSize:'100%', borderColor:'black', marginBottom: '20px' }} key={video.id}>
                        <div style={{ justifyContent: 'space-between', height: 'auto', width: '100%', display: 'flex' }}>
                          <span style={{ backgroundColor: "rgb(1,2,3,.6", overflow:'hidden', whiteSpace: "nowrap", textOverflow: "clip", height:"min-content"}}>{ video.video_title }</span>
                          <div style={{ justifyContent: 'space-between', width: 'auto', display: 'flex', flexDirection: 'column' }}>
                            <span style={{ backgroundColor: "rgb(1,2,3,.6", paddingLeft:'10px', height:'21px', textAlign:'right'}}>{ this.formatDuration(video.duration)}</span>
                            <span style={{width: 'auto', paddingLeft:'10px', color:'white', textAlign:"right"}}>
                              <FaThumbsUp onClick={() => this.upVote(video)} className={css`color: #0C696A; opacity: 0.8; &:hover {color: #BEDE5C;opacity: 1}`} style={{ cursor:"pointer", textShadow: '1px 1px 1px #ccc' }}/> 
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                }
              </div>
            </div>
          <div className="col-3" style={{justifyContent:"center"}}>
          <h1 style={{ color:"white" }}>Results:</h1>
            {
              this.state.results.length === 0
              ? ''
              : <SearchResults  addToPlaylist = { this.addToPlaylist } results={this.state.results}/>
            }
          </div>
        </div>
      </div>
    </div>
    )
  }
};

export default Playlists;