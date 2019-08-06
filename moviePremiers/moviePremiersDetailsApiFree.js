const request = require('request');
var RateLimiter = require('request-rate-limiter');
const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

/*pool.query('TRUNCATE tv_series;',
    (error, results) => {
        console.log(results);

    });
    */

var limiter = new RateLimiter({
    rate: 5 // requests per interval,

        ,
    maxWaitingTime: 1500 // return errors for requests
    // that will have to wait for
    // n seconds or more. defaults
    // to 5 minutes
});


pool.query('SELECT tmdb_id, imdb_id FROM movie_premiers', (error, results) => {

    results.rows.forEach(function(value) {
        limiter.request({
            url: 'https://api.themoviedb.org/3/movie/' + value.tmdb_id + '?api_key=f4e6009df6f9b64f5063de615df82bf9&language=en-US',

        }).then(function(theMovieDb) {

            pool.query(
                'UPDATE movie_premiers SET production = $1, runtime = $2, official_website = $3 WHERE tmdb_id = $4',
                [
                    JSON.parse(theMovieDb).production_companies,
                    JSON.parse(theMovieDb).runtime,
                    JSON.parse(theMovieDb).homepage,
                    value.tmdb_id
                ],
                (error, results) => {
                    if (error) {
                        console.log('movie_premiers UPDATE themoviedb: an error occured', error);
                    }
                    console.log('movie_premiers UPDATE themoviedb: ok done');

                });


            request(
                'http://www.omdbapi.com/?apikey=13b6a95b&i=' + value.imdb_id,
                function(error, response, omdbApi) {


                    pool.query(
                        'UPDATE movie_premiers SET director = $1, writer = $2, awards = $3 WHERE imdb_id = $4',
                        [
                            JSON.parse(omdbApi).Director,
                            JSON.parse(omdbApi).Writer,
                            JSON.parse(omdbApi).Awards,
                            value.imdb_id
                        ],
                        (error, results) => {
                            if (error) {
                                console.log('movie_premiers UPDATE omdbapi: an error occured');
                            }
                            console.log('movie_premiers UPDATE omdbapi: ok done');
                        }
                    )

                });
        });
    });

});