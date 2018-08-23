import React, { Component } from 'react';

class SearchResults extends Component {
  state = {
    clickedId: 'tgbNymZ7vqY',
  }
  render() {
    const { results } = this.props;
    return (
        <div classname="searchResults">
          <div className="row" style={{width:"100%", justifyContent:"center"}}>
              <iframe title="iframe1"width="600" height="450"
                src={`https://www.youtube.com/embed/${this.state.clickedId}`}>
              </iframe>
          </div>
          <div className="row" style={{width:"100%", justifyContent:"center"}}>
            {results.map( result => (
              <a key={result.id} href={`https://www.youtube.com/watch?v=${result.id}`}>
                <div className="col-3" style={{cursor:"pointer", margin:"5px", height:"40vh", minWidth:"400px", backgroundSize: "100% 250px", backgroundRepeat: "no-repeat", backgroundImage:`url("${result.thumbnails.high.url}")`}}>
                  <h2 style={{ backgroundColor:"rgb(0, 0, 0, .5)",  maxWidth:"380px", justifySelf:"flex-end", color:"white"}}>{result.localized.title}</h2>
                  <span style={{ justifySelf:"flex-end", color:"white"}}>{result.duration.split("H").join(":").split("M").join(":").split("PT").join('').split("S").join("")}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
    )
  }
};

export default SearchResults;
