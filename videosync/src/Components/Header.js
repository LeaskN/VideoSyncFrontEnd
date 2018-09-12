import React from 'react';

const Header = () => (
    <nav style={{backgroundColor:"#00696B"}} className="navbar navbar-expand navbar-dark">
      <div className="navbar-collapse" id="navbarColor01">
        <a className="nav-link" href="/">
          <img alt="Video Sync" src="/media/logo_transparent.png" height="70px"></img>
        </a>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link" href="/createplaylist">Create A Playlist</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/playlists">Join a Playlist</a>
          </li>
        </ul>
      </div>
    </nav>
);

export default Header;