import React, { Component } from 'react';

class SearchResults extends Component {
  state = {
    clickedId: ''
  };

  searchResultClicked = (result) => {
    this.props.addToPlaylist(result);
  }

  formatDuration(duration){
    let firstIteration = duration.split('PT').join('').split('S').join('');
    let mSplit = firstIteration.split('M');
    let seconds = mSplit[mSplit.length-1] || '00';
    let hSplit = mSplit[0].split('H');
    let mins;
    let hours;
    if (hSplit.length === 2) {
      hours = hSplit[0]
      mins = hSplit[1]
    } else {
      hours = 0;
      mins = hSplit[0];
    }
    const pad = number => number.length === 1 ? '0' + number : number
    return `${pad(hours)}:${pad(mins)}:${pad(seconds)}`
  }
  render() {
    const { results } = this.props;
    return (
      <div style={{justifyContent:"center"}}>
        {results.map( result => (
          <div key={ result.id } onClick={() => this.searchResultClicked(result)} style={{cursor:"pointer", height:'120px', width:'200px', backgroundSize: "250px 140px", backgroundRepeat: "no-repeat", backgroundImage:`url("${result.thumbnails.high.url}")`, marginBottom:'20px'}}>
            <h6 style={{ backgroundColor:"rgb(0, 0, 0, .5)",  maxWidth:"380px", justifySelf:"flex-end", color:"white", }}>{result.localized.title}</h6>
            <span style={{ borderRadius:"10%", backgroundColor:"rgb(0, 0, 0, .5)", justifySelf:"flex-end", color:"white"}}>{this.formatDuration(result.duration)}</span>
          </div>
        ))}
      </div>
    )
  }
};

export default SearchResults;
