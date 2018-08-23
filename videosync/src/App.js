import React, { Component } from 'react';
import './App.css';
import {Typeahead} from 'react-bootstrap-typeahead';
import SearchResults from './Components/SearchResults';

class App extends Component {
  state = {
    searchTerm: '',
    options: [],
    results: []
  }
  searchingForVideo = (event) => {
    this.setState({
      searchTerm: event
    })
    if (event.trim()) {
      fetch(`http://localhost:5000/api/v1/videos/suggestion/${event}`)
      .then((req)=> req.json())
      .then((response) => {
        let newOptions = response
        this.setState({
          options: newOptions,
        })
      })
    }
  }
  submitted = (e) => {
    e.preventDefault();
    if (this.state.searchTerm.trim()) {
      fetch(`http://localhost:5000/api/v1/videos/search/${this.state.searchTerm}`)
      .then((req)=> req.json())
      .then((response) => {
        const snippets = response.items.map(item => ({
          ...item.snippet, 
          id: item.id,
          ...item.contentDetails
        }))
        console.log(response.items);
        this.setState({
          results: snippets,
        })
      })
    }
  }
  render() {
    return (
      <div className="app">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarColor01">
          <a className="navbar-brand" style={{ justifyContent:"space-between" }} href="">VideoSync</a>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link" href="">Create A Room</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="">Join a Room</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="" >Login</a>
              </li>
            </ul>
          </div>
        </nav>
        <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ justifyContent:"center" }}>
            <form className="form-inline my-2 my-lg-0" onSubmit={this.submitted}>
              <Typeahead type="text" placeholder="Search" selectHintOnEnter={true} onInputChange={this.searchingForVideo} labelKey={option => `${option}`}
                            options={this.state.options}/>
              <button className="btn btn-secondary my-2 my-sm-0" style={{marginLeft: "5px"}} type="submit">Search</button>
            </form>
        </nav>
        {
          this.state.results.length > 0
          ? <SearchResults results={this.state.results}/>
          : ''
        }
      </div>
    );
  }
}

export default App;