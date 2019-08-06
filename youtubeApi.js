var YouTube = require('youtube-node');

var youTube = new YouTube();

youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

youTube.search('Chernobyl Official Trailer', 2, function(error, result) {
  if (error) {
    console.log(error);
  }
  else {
  	console.log(result);
  	var array = [];
  	for (let i = 0; i < result.items.length; i++) {
    	console.log(JSON.stringify(result.items[i].id.videoId, null, 2));
    	console.log(JSON.stringify(result.items[i].snippet.title, null, 2));
    	array.push(result.items[i].id.videoId);
	}
	console.log(array);
  }
});


/*
const pgConfig = require('./config/config.js');

var pgSelect = [' SELECT '];
var pgItems =
	[
		'cinema_premier_id',
		'movie_name'
	];
var pgFrom = [' FROM '];
var pgDatabase = [' now_playing_movies '];

var array = [];
for (let i = 0; i < pgItems.length; i++) {
	array.push(pgItems[i]);
}
console.log(array.join(' , '));
var dbSelect = pgSelect + array.join(' , ') + pgFrom + pgDatabase;
console.log(dbSelect);


pgConfig.query(dbSelect, (error, results) => {
    if (results.rowCount !== 0) {
        results.rows.forEach(function(value) {
            console.log(value.cinema_premier_id);
        });
    }
});

*/