const dbConfig = require('../../config/config.js');

module.exports = {
    nowPlayingMoviesInsertToDb: function(object) {
        //console.log('INSERT ----', object);
        dbConfig.query(
            'INSERT INTO now_playing_movies ( movie_name, genre, image, original_name, runtime, distributor, cinema_premier_id, release_date, description, insert_flag) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
            [
                object.hu_title,
                object.genres,
                object.poster_thumb,
                object.original_title,
                object.runtime,
                object.distributor,
                object.id,
                object.hu_release,
                object.hu_plot,
                1
            ],
            (error, results) => {
                if (error) {
                    console.log('now_playing_movies INSERT: an error occured', error);
                }
                console.log('now_playing_movies INSERT: ok done');
            });
    },

}