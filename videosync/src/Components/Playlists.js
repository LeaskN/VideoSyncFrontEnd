import React, { Component } from 'react'; 

class Playlists extends Component {
  state = {
    isLoading:true,
    playlists: []
  };

  componentDidMount(){
    const API_URL = 'https://videosink.herokuapp.com/api/v1/playlists/' ||'http://localhost:5000/api/v1/playlists';
    fetch(API_URL)
      .then(res => res.json())
      .then(playlists => {
        setTimeout(() => {
          this.setState({
            playlists,
            isLoading: false
          });
        }, 700);
      })
  }

  render() {
    console.log(this.state.playlists);
    return (      
      <div>
        <h1>Playlist Page</h1>
        { this.state.isLoading ? <h2>Loading Playlists...</h2> :
          this.state.playlists.map(playlist => (
            <div key={playlist.id} className='card'>
              <div className="card-header">{ playlist.title }</div>
              <div className="card-body">
                <h4 className="card-title">TILED THUMBNAILS BELOW:</h4>
                <p className="card-text">THIS IS WHERE THE IMAGE WILL GO?</p>
              </div>
            </div>
          ))}
      </div>
    );
  }
}

export default Playlists;