var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id: '19e3b2f623934c5fb0b81b565bf7e23f',
  secret: '9745c2fc17dd43639f13f24a51a43a50'
});
 
spotify.search({ type: 'album', query: 'Fight Club soundtrack' }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
 
console.log(data.albums.items[0].id); 


spotify
  .request('https://api.spotify.com/v1/playlist/' + data.albums.items[0].id)
  .then(function(data) {
    console.log(data); 
  })
  .catch(function(err) {
    console.error('Error occurred: ' + err); 
  });
});