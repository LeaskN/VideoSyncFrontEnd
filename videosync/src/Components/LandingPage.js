import React, { Component } from 'react';
import YouTube from 'react-youtube';

class LandingPage extends Component {
  render() {
    return(
        <div>
            <div>
                <div className="alert" style={{ backgroundColor:"#145c5c" }}>
                <h4 className="heading" style={{ textAlign:"center" }}>Welcome to Video Sync!</h4><hr/>
                <div style={{ textAlign:"center" }} className="container">
                    <h6> Video Sync is a web app which enables users to have the functionality of bluetooth, wireless speakers or surround sound right at the tip of their fingers. </h6>
                    <h6> Check out the demo video below and then click either join or create a playlist in the top right!</h6>
                    <h5> Enjoy!</h5>
                </div>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <YouTube
                videoId="0YP3KRfBxUU"
                />
            </div>
        </div>
    )
  }
};

export default LandingPage;