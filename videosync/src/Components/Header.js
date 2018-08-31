import React from 'react';

const Header = () => (
    <nav style={{backgroundColor:"#00696B"}} className="navbar navbar-expand-lg navbar-dark">
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarColor01">
      <a className="navbar-brand" style={{ justifyContent:"space-between" }} href="/">VideoSync</a>
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
);

export default Header;