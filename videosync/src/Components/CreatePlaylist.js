import React, { Component } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { getSuggestions, getVideoOptions, putVideosOnPlaylist, getVideosByPlaylist } from '../API';
import SearchResults from './SearchResults';

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
          console.log(this.state.options);
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
        console.log(this.state.results);
        
      })
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
  addtoList = (video) => {
    console.log(video);
    this.setState({
      creating: true,
    });
    const { id } = this.props.match.params;
    console.log(id);
    
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
            });   
          } else {
            window.location.href = 'https://videosink.herokuapp.com/notfound' || "http://localhost:3000/notfound"
          }
      })
  }
  render(){
    return(
    <div>
      <div className="container alert" style={{backgroundColor:"#138C8D", display:"flex", justifyContent:"space-evenly", flexDirection:"column", alignContent:"space-around"}} >
        <div className="row">
          <h4 className="heading">Create A Playlist!</h4>
          <p className="mb-0">Add a name and choose your first few songs using the search bar above. You can add more at any time once your playlist has been created!</p>
        </div>
        <div className="row">
          <div className="col">
            <form className="form-inline my-2 my-lg-0" onSubmit={this.submitted}>
              <Typeahead style={{ width: '300px'}} type="text" placeholder="Search" selectHintOnEnter={true} onInputChange={this.searchingForVideo} labelKey={option => `${option}`} options={this.state.options}/>
              <button className="btn btn-secondary my-2 my-sm-0" style={{marginLeft: "5px"}} type="submit">Search</button>
            </form>
          </div>
          <div className="col">
            <form>
              <div className="form-group">
                <input type="text" className="form-control" id="formGroupExampleInput" placeholder="Playlist Name:"/>
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
        <div className="row">
          <div className="col-7" style={{justifyContent:"center"}}>
            <h1 style={{ color:"white" }}>Playlist Videos:</h1>
                <div style={{ justifyContent: 'space-around', margin: '1px' }} className="row">
                  { this.state.isLoading? <h2>Search and select some songs! </h2>:
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

export default CreatePlaylist;