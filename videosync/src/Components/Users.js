import React, { Component } from 'react';
import { FaUserAstronaut, FaUserNinja, FaUserSecret, FaUserTie, FaUserGraduate, FaPoo } from 'react-icons/fa';


class Users extends Component {
  state = {
    clickedId: 'tgbNymZ7vqY'
  };
  render() {    
    return (
      <div style={{justifyContent:"center"}}>
        <div style={{backgroundColor:"#138C8D"}}className="card text-white mb-3">
          <div className="card-header">Users:</div>
          <div className="card-header"><FaUserAstronaut/> <FaUserNinja/> <FaUserSecret/> <FaUserTie/> <FaUserGraduate/> <FaPoo/> </div>
          <div className="card-body">
            <p className="card-text">
            </p>
              <FaUserAstronaut/> Howdy!<hr/>
              <FaUserGraduate/> How's it going?<hr/>
              <FaUserSecret/> You'd like to know!<hr/>
              <FaUserGraduate/> I just want a job 😭<hr/>
              <FaPoo/> This playlist is crap!<hr/>
          </div>
        </div>
      </div>
    )
  }
};

export default Users;
