const YouTube = require('youtube-node');
const youTube = new YouTube();
youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');
const moment = require('moment');
const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

module.exports = {
    trailer: function(value) {

        youTube.search(value.originalName + ' ' + 'Official Trailer' + ' ' + moment(value.releaseDate).format("YYYY"), 2, function(error, result) {
            if (error) {
                console.log('Youtube Error', error);
            } else {
                var trailerIds = [];
                for (let i = 0; i < result.items.length; i++) {
                    console.log(JSON.stringify(result.items[i].id.videoId, null, 2));
                    console.log(JSON.stringify(result.items[i].snippet.title, null, 2));
                    trailerIds.push(result.items[i].id.videoId);
                }
                console.log(trailerIds);

                pool.query(
                    'INSERT INTO movie_trailer (imdb_id, movie_original_name, trailer_ids) VALUES ($1, $2, $3);',
                    [
                        value.imdbId,
                        value.originalName,
                        trailerIds
                    ],
                    (error, results) => {
                        if (error) {
                            console.log('now_playing_movies INSERT: an error occured', error);
                        }
                        console.log('now_playing_movies INSERT: ok done');

                    });
            }
        });
    }
}