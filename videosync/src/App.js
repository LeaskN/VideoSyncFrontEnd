import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Header from './Components/Header';
import NotFound from './Components/NotFound';
import LandingPage from './Components/LandingPage';
import Playlist from './Components/Playlist';
import CreatePlaylist from './Components/CreatePlaylist';

class App extends Component {
  state = {
    searchTerm: '',
    options: [],
    results: [],
    isLoading: true,
    clickedId: 'tgbNymZ7vqY',
    playlists: [],
    playlist: [],
  };
  
  componentDidMount() {
    const API_URL = 'https://videosink.herokuapp.com/api/v1/playlists' || 'http://localhost:5000/api/v1/playlists'
    fetch(API_URL)
      .then(res => res.json())
      .then(playlists => {
        setTimeout(() => {
          this.setState({
            playlists,
            isLoading: false
          })
        }, 700);
      });
  }
  render() {
    return (
      <div className="app">
        <Header/>
        <Switch>
          <Route exact path="/playlists" render={(routeProps) => (
              <LandingPage {...routeProps} {...this.props} playlists={this.state.playlists}/>
            )}
          />
          <Route path="/createplaylist" component={CreatePlaylist}/>
          <Route path="/playlists/:id" component={Playlist}/>
          <Route path="*" component={NotFound}/>
        </Switch>
      </div>
    );
  }
}

export default App;