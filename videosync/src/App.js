import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Header from './Components/Header';
import NotFound from './Components/NotFound';
import Playlists from './Components/Playlists';
import LandingPage from './Components/LandingPage';
import Playlist from './Components/Playlist';


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
    const API_URL = 'http://localhost:5000/api/v1/playlists'
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
          <Route exact path="/" component={LandingPage}/>
          <Route exact path="/playlists" component={Playlists}/>
          <Route path="/playlists/:id" component={Playlist}/>
          <Route path="*" component={NotFound}/>
        </Switch>
      </div>
    );
  }
}

export default App;