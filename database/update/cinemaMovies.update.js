const dbConfig = require('../../config/config.js');
const cinemaHelpers = require('../../common/helpers/cinema.helpers.js');
let updateHelpers = new cinemaHelpers();

module.exports = {
    nowPlayingMoviesUpdate: function(object) {
        var update = object;
        //var query = updateHelpers.databaseStructure(update);
        dbConfig.query(
            'UPDATE now_playing_movies SET insert_flag = 1 WHERE cinema_premier_id = $1',
            [
                object.id,
            ],
            (error, results) => {
                if (error) {
                    console.log('now_playing_movies UPDATE: an error occured', error);
                }
                console.log('now_playing_movies UPDATE: ok done');

            });
    },

}