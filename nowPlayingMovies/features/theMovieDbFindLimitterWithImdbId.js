const RateLimiter = require('request-rate-limiter');
const limiter = new RateLimiter({
    rate: 10 // requests per interval,

        ,
    maxWaitingTime: 1500 // return errors for requests
    // that will have to wait for
    // n seconds or more. defaults
    // to 5 minutes
});

module.exports = {
    find: function(response) {
        console.log('-----', response);

        limiter.request({
            url: 'https://api.themoviedb.org/3/find/' + response + '?api_key=f4e6009df6f9b64f5063de615df82bf9&language=hu-HU&external_source=imdb_id',
        }).then(function(response) {

            if (typeof JSON.parse(response.body).movie_results !== 'undefined') {

                tmdb.find({
                    tmdb: JSON.parse(response.body).movie_results,
                    cinemaPremier: {
                        description: value.description,
                        cinema_premier_id: value.cinema_premier_id,
                    }
                });
            }

            if (typeof JSON.parse(response.body).movie_results !== 'undefined') {

                for (var key in JSON.parse(response.body).movie_results) {
                    //console.log(JSON.parse(response.body).movie_results[key].backdrop_path);
                    var overview = typeof JSON.parse(response.body).movie_results[key].overview !== 'undefined' &&
                        JSON.parse(response.body).movie_results[key].overview !== '' ? JSON.parse(response.body).movie_results[key].overview : value.description;

                    pool.query(
                        'UPDATE now_playing_movies SET backdrop_path = $1 WHERE cinema_premier_id = $2 AND backdrop_path IS NULL;',
                        [
                            'https://image.tmdb.org/t/p/original/' + JSON.parse(response.body).movie_results[key].backdrop_path,
                            value.cinema_premier_id
                        ],
                        (error, results) => {
                            if (error) {
                                console.log('now_playing_movies UPDATE backdrop_path: an error occured');
                            }
                            console.log('now_playing_movies UPDATE backdrop_path: ok done');
                        }
                    )

                    pool.query(
                        'UPDATE now_playing_movies SET tmdb_id = $1 WHERE cinema_premier_id = $2 AND tmdb_id IS NULL;',
                        [
                            JSON.parse(response.body).movie_results[key].id,
                            value.cinema_premier_id
                        ],
                        (error, results) => {
                            if (error) {
                                console.log('now_playing_movies UPDATE tmdb_id: an error occured');
                            }
                            console.log('now_playing_movies UPDATE tmdb_id: ok done');
                        }
                    )

                    pool.query(
                        'UPDATE now_playing_movies SET description = $1 WHERE cinema_premier_id = $2;',
                        [
                            overview,
                            value.cinema_premier_id
                        ],
                        (error, results) => {
                            if (error) {
                                console.log('now_playing_movies UPDATE description: an error occured');
                            }
                            console.log('now_playing_movies UPDATE description: ok done');
                        }
                    )
                }
            }
        });

    }
}