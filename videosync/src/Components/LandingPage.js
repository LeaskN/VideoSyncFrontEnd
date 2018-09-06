import React from 'react'; 

const LandingPage = () => (
  <div style={{backgroundColor:"#138C8D", display:"flex", justifyContent:"space-evenly", flexDirection:"column", alignContent:"space-around"}} class="alert">
    <h4 class="heading">Landing Page!!</h4>
    <p class="mb-0">Welcome!</p>
      <button style={{display:"flex", width:"100px", marginBottom:"5px", justifyContent:"center"}} type="button" class="btn btn-primary"><a href="./playlists/1/videos" class="btn btn-default">Playlists1</a></button>   
      <button style={{display:"flex", width:"100px", marginBottom:"5px", justifyContent:"center"}} type="button" class="btn btn-primary"><a href="./playlists/2/videos" class="btn btn-default">Playlists2</a></button>      
      <button style={{display:"flex", width:"100px", marginBottom:"5px", justifyContent:"center"}} type="button" class="btn btn-primary"><a href="./playlists/3/videos" class="btn btn-default">Playlists3</a></button>      
      <button style={{display:"flex", width:"100px", marginBottom:"5px", justifyContent:"center"}} type="button" class="btn btn-primary"><a href="./playlists/4/videos" class="btn btn-default">Playlists4</a></button> 
      <button style={{display:"flex", width:"100px", marginBottom:"5px", justifyContent:"center"}} type="button" class="btn btn-primary"><a href="./playlists/5/videos" class="btn btn-default">Playlists5</a></button>      
      <button style={{display:"flex", width:"100px", marginBottom:"5px", justifyContent:"center"}} type="button" class="btn btn-primary"><a href="./playlists/6/videos" class="btn btn-default">Playlists6</a></button>      
  </div>
);

export default LandingPage;