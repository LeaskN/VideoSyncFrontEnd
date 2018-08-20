import React, { Component } from 'react';
import './App.css';
import { navbar } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <div className="app">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarColor01">
          <a className="navbar-brand" style={{ justifyContent:"space-between" }} href="#">VideoSync</a>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link" href="#">Create A Room</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Join a Room</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" >Login</a>
              </li>
            </ul>
          </div>
        </nav>
        <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ justifyContent:"center" }}>
            <form className="form-inline my-2 my-lg-0">
              <input className="form-control mr-sm-2" type="text" placeholder="Search" style={{ width: "300px" }}/>
              <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
            </form>
        </nav>
      </div>
    );
  }
}

export default App;
