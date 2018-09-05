export function getSuggestions(event) {
  return fetch(`http://localhost:5000/api/v1/videos/suggestion/${event}}`)
    .then((req)=> req.json())
}

export function getVideoOptions(term) {
  return fetch(`http://localhost:5000/api/v1/videos/search/${term}`)
    .then((req)=> req.json())
}

export function putVideosOnPlaylist(id, videos) {
  const API_URL = `http://localhost:5000/api/v1/playlists/${id}/videos`
  return fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(videos),
    headers: {
      'content-type': 'application/json'
    }
  }).then(res => res.json())
}

export function getVideosByPlaylist(id) {
  const API_URL = `http://localhost:5000/api/v1/playlists/${id}/videos`;
  return fetch(API_URL)
    .then(res => res.json())
}
