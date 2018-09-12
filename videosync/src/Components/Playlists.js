import React from 'react'; 


const Playlists = ({ playlists }) => {  
  return <div className="alert" style={{ backgroundColor:"#145c5c" }}>
    <h4 className="heading">Pick a Playlist From Below!</h4>
    <div className="row alert" style={{backgroundColor:"#104b4b"}}>
      { playlists.length === 0 ? <div id="loader"></div>:
          playlists.map(playlist => (
            <button style={{display:"flex", width:"100px", marginBottom:"5px", marginRight:"5px", justifyContent:"center"}} type="button" className="btn btn-primary">
              <a key = {`${playlist.id}`} href={`./${playlist.id}/videos`} className="btn btn-default">{playlist.title}</a>
            </button>   
          ))
      }
    </div>
  </div>
};

export default Playlists;