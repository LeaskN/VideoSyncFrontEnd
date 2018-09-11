const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/v1' : 'https://videosink.herokuapp.com/api/v1'

export function getSuggestions(event) {
  return fetch(`${API_URL}/videos/suggestion/${event}` )
    .then(req => req.json())
}

export function getVideoOptions(term) {
  return fetch(`${API_URL}/videos/search/${term}` )
    .then(req => req.json())
}

export function getPlaylists() {
  return fetch(`${API_URL}/playlists`)
    .then(res => res.json())
}

export function createPlaylist(title) {
  return fetch(`${API_URL}/playlists`, {
      method: 'POST',
      body: JSON.stringify({ title }),
      headers: {
        'content-type': 'application/json'
      }
    }).then(res => res.json())
}

export function putVideosOnPlaylist(id, videos) {
  const currentAPI_URL = `${API_URL}/playlists/${id}/videos`
  return fetch(currentAPI_URL, {
    method: 'POST',
    body: JSON.stringify(videos),
    headers: {
      'content-type': 'application/json'
    }
  }).then(res => res.json())
}

export function getVideosByPlaylist(id) {
  const currentAPI_URL = `${API_URL}/playlists/${id}/videos`;
  return fetch(currentAPI_URL)
    .then(res => res.json())
}
