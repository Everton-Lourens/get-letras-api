var BASE_URL = 'http://localhost:9999/v1/lyrics';

function createUrlToSearch(input) {
  if (!input.text) return null;
  
  var params = 'text=' + encodeURIComponent(input.text);
  if (input.title) params += '&title=true';
  if (input.artist) params += '&artist=true';
  if (input.lyrics) params += '&lyrics=true';
  
  return BASE_URL + '/search?' + params;
}

function parseSearchResponseToList(response) {
  try {
    var json = JSON.parse(response);
    var songs = [];
    for (var i = 0; i < json.length; i++) {
      songs.push({
        'id': json[i]['id'],
        'title': json[i]['title'],
        'artist_or_author': json[i]['author'] || json[i]['artist']
      });
    }
    return songs;
  } catch (error) {
    return [];
  }
}

function createUrlToGetById(id) {
  if (!id) return null;
  return BASE_URL + '/get?id=' + encodeURIComponent(id);
}

function parseGetResponseToSong(response) {
  try {
    var json = JSON.parse(response);
    return {
      'title': json['title'],
      'artist': json['artist'],
      'author': json['author'],
      'lyrics': json['lyrics']
    };
  } catch (error) {
    return null;
  }
}

function searchSongs(input, callback) {
  var url = createUrlToSearch(input);
  if (!url) return callback([]);

  fetch(url)
    .then(function(res) { return res.text(); })
    .then(function(text) { callback(parseSearchResponseToList(text)); })
    .catch(function(error) {
      callback([]);
    });
}

function getSongById(id, callback) {
  var url = createUrlToGetById(id);
  if (!url) return callback(null);

  fetch(url)
    .then(function(res) { return res.text(); })
    .then(function(text) { callback(parseGetResponseToSong(text)); })
    .catch(function(error) {
      callback(null);
    });
}
