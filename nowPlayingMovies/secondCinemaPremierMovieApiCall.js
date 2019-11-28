const request = require('request');
const dbConfig = require('../config/config.js');
const RateLimiter = require('request-rate-limiter');
const bcrypt = require('bcrypt');
const moment = require('moment');
//const database = require('../database/update/insertFlag.update.js');

//const youtube = require('./features/youtubeMovieTrailer.js');
const movie = require('./thirdOmdbApiCallFree.js');
//let updateHelpers = new movie();


const limiter = new RateLimiter({
    rate: 10 // requests per interval,

        ,
    maxWaitingTime: 1500 // return errors for requests
    // that will have to wait for
    // n seconds or more. defaults
    // to 5 minutes
});


function characterReplace(str) {
    var string = '';
    var chart = '';
    for (i = 0; i < str.length; i++) { //fixed spelling from 'str.lenght'

        string = string + str.charAt(i)
            .replace(" ", "_")
            .replace(":", "_")
            .toLowerCase();

    }
    return string;
}

function createUniqueActorId(object) {
    return characterReplace(object.name) + '_' + object.imdbId;
}

function kebabToSnake(str) {
    var string = '';
    var chart = '';
    for (i = 0; i < str.length; i++) { //fixed spelling from 'str.lenght'

        string = string + str.charAt(i)
            .replace(" ", "_")
            .replace("á", "a")
            .replace("é", "e")
            .replace("í", "i")
            .replace("ó", "o")
            .replace("ö", "o")
            .replace("ő", "o")
            .replace("ú", "u")
            .replace("ű", "u")
            .replace("ü", "u")
            .replace(/[^_!a-zA-Z ]/g, "")
            .toLowerCase();

    }
    return string;
}

module.exports = {

  /**
   * DB Query
   * @param {object} req
   * @param {object} res
   * @returns {object} object 
   */
    cinema: function(value, check) {
        let movieImdbId = [];
        let movieTrailerImdbId = [];
        dbConfig.query('SELECT imdb_id FROM movie_trailer;', (error, movieTrailerResults) => {
            if (movieTrailerResults.rowCount !== 0) {
                movieTrailerResults.rows.forEach(function(movieTrailerValue) {
                    movieTrailerImdbId.push(movieTrailerValue.imdb_id);
                });
            }
            dbConfig.query('SELECT id FROM movie_imdb_id;', (error, movieImdbIdResults) => {
                if (movieImdbIdResults.rowCount !== 0) {
                    movieImdbIdResults.rows.forEach(function(movieImdbIdValue) {
                        movieImdbId.push(movieImdbIdValue.id);
                    });
                }

                //dbConfig.query('SELECT originalname, cinema_premier_id, movie_name, imdb_id, description, release_date FROM now_playing_movies WHERE insert_flag = 1;', (error, results) => {

                // results.rows.forEach(function(value) {

                request(
                    'https://mozipremierek.hu/api/movie/' + value.cinema_premier_id,
                    function(error, response, cinemaPremierDataOnShow) {
                        if (typeof JSON.parse(cinemaPremierDataOnShow).imdb_id !== 'undefined' && JSON.parse(cinemaPremierDataOnShow).imdb_id !== '') {

                            if (movieImdbId.indexOf(JSON.parse(cinemaPremierDataOnShow).imdb_id) === -1) {

                                dbConfig.query(
                                     `INSERT INTO
                                         movie_imdb_id (
                                             movie_name,
                                             id,
                                             flag )
                                         VALUES ($1, $2, $3);`,
                                    [
                                        value.movie_name,
                                        JSON.parse(cinemaPremierDataOnShow).imdb_id,
                                        1
                                    ],
                                    (error, results) => {
                                        if (error) {
                                            console.log('movie_imdb_id INSERT: an error occured', error);
                                        }
                                        console.log('movie_imdb_id INSERT: ok done');

                                    });
                            } else {
                                dbConfig.query(
                                    `UPDATE 
                                        movie_imdb_id 
                                    SET 
                                        flag = $1 
                                    WHERE 
                                        id = $2;`,
                                    [
                                        1,
                                        JSON.parse(cinemaPremierDataOnShow).imdb_id
                                    ],
                                    (error, results) => {
                                        if (error) {
                                            console.log('movie_imdb_id flag UPDATE: an error occured', error);
                                        }
                                        console.log('movie_imdb_id iflag UPDATE: ok done');
                                    }
                                )

                            }

                            if (check === 'insert') {
                                dbConfig.query(
                                    `UPDATE 
                                        now_playing_movies 
                                    SET 
                                        imdb_id = $1 
                                    WHERE 
                                        cinema_premier_id = $2 
                                    AND 
                                        imdb_id IS NULL;`,
                                    [
                                        JSON.parse(cinemaPremierDataOnShow).imdb_id,
                                        value.cinema_premier_id
                                    ],
                                    (error, results) => {
                                        if (error) {
                                            console.log('now_playing_movies imdb_id INSERT: an error occured');
                                        }
                                        console.log('now_playing_movies imdb_id INSERT: ok done');
                                        new movie().detailsByImdbId({
                                            imdb_id: JSON.parse(cinemaPremierDataOnShow).imdb_id,
                                            cinema_premier_id: value.cinema_premier_id,
                                        });
                                        new movie().posterByImdbId({
                                            imdb_id: JSON.parse(cinemaPremierDataOnShow).imdb_id,
                                            cinema_premier_id: value.cinema_premier_id,
                                        });
                                    }
                                )

                                limiter.request({
                                    url: 'https://api.themoviedb.org/3/find/' + JSON.parse(cinemaPremierDataOnShow).imdb_id + '?api_key=f4e6009df6f9b64f5063de615df82bf9&language=hu-HU&external_source=imdb_id',
                                }).then(function(response) {

                                    if (typeof JSON.parse(response.body).movie_results !== 'undefined') {

                                        for (var key in JSON.parse(response.body).movie_results) {
                                            //console.log(JSON.parse(response.body).movie_results[key].backdrop_path);
                                            var overview = typeof JSON.parse(response.body).movie_results[key].overview !== 'undefined' &&
                                                JSON.parse(response.body).movie_results[key].overview !== '' ? JSON.parse(response.body).movie_results[key].overview : value.description;

                                            dbConfig.query(
                                                `UPDATE 
                                                    now_playing_movies 
                                                SET 
                                                    backdrop_path = $1 
                                                WHERE
                                                    cinema_premier_id = $2
                                                AND 
                                                    backdrop_path IS NULL;`,
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

                                            dbConfig.query(
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
                                                    new movie().detailsByTmdbId({
                                                        tmdb_id: JSON.parse(response.body).movie_results[key].id
                                                    });
                                                }
                                            )

                                            dbConfig.query(
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

                                if (movieTrailerImdbId.indexOf(value.imdb_id) === -1) {
                                    new movie().trailer({
                                        originalName: value.originalname,
                                        releaseDate: value.release_date,
                                        imdbId: value.imdb_id,
                                    });
                                }
                            }
                        } else {
                            request(
                                'https://v2.sg.media-imdb.com/suggestion/' +
                                kebabToSnake(value.originalname)
                                .charAt(0)
                                .toLowerCase() +
                                '/' +
                                kebabToSnake(value.originalname) +
                                '.json',
                                function(error, response, body) {

                                    // q === 'feature'
                                    // y === year
                                    if (typeof JSON.parse(body).d !== 'undefined') {

                                        JSON.parse(body).d.forEach(function(data) {

                                            if (data.y === parseInt(moment(value.release_date).format('YYYY')) && data.q === 'feature') {

                                                if (movieImdbId.indexOf(data.id) === -1) {

                                                    dbConfig.query(
                                                        'INSERT INTO movie_imdb_id ( movie_name, id, flag ) VALUES ($1, $2, $3)',
                                                        [
                                                            value.movie_name,
                                                            data.id,
                                                            1
                                                        ],
                                                        (error, results) => {
                                                            if (error) {
                                                                console.log('movie_imdb_id INSERT: an error occured', error);
                                                            }
                                                            console.log('movie_imdb_id INSERT: ok done');

                                                        });
                                                } else {
                                                    dbConfig.query(
                                                        'UPDATE movie_imdb_id SET flag = $1 WHERE id = $2',
                                                        [
                                                            1,
                                                            data.id
                                                        ],
                                                        (error, results) => {
                                                            if (error) {
                                                                console.log('movie_imdb_id flag UPDATE: an error occured', error);
                                                            }
                                                            console.log('movie_imdb_id flag UPDATE: ok done');
                                                        }
                                                    )

                                                }

                                                if (check === 'insert') {

                                                    dbConfig.query(
                                                        'UPDATE now_playing_movies SET imdb_id = $1 WHERE cinema_premier_id = $2 AND imdb_id IS NULL;',
                                                        [
                                                            data.id,
                                                            value.cinema_premier_id
                                                        ],
                                                        (error, results) => {
                                                            if (error) {
                                                                console.log('now_playing_movies imdb_id INSERT: an error occured');
                                                            }
                                                            console.log('now_playing_movies imdb_id INSERT: ok done');
                                                            new movie().detailsByImdbId({
                                                                imdb_id: data.id,
                                                                cinema_premier_id: value.cinema_premier_id,
                                                            });
                                                            new movie().posterByImdbId({
                                                                imdb_id: data.id,
                                                                cinema_premier_id: value.cinema_premier_id,
                                                            });
                                                        }
                                                    )

                                                    limiter.request({
                                                        url: 'https://api.themoviedb.org/3/find/' + data.id + '?api_key=f4e6009df6f9b64f5063de615df82bf9&language=hu-HU&external_source=imdb_id',
                                                    }).then(function(response) {

                                                        if (typeof JSON.parse(response.body).movie_results !== 'undefined') {

                                                            for (var key in JSON.parse(response.body).movie_results) {
                                                                //console.log(JSON.parse(response.body).movie_results[key].backdrop_path);
                                                                var overview = typeof JSON.parse(response.body).movie_results[key].overview !== 'undefined' &&
                                                                    JSON.parse(response.body).movie_results[key].overview !== '' ? JSON.parse(response.body).movie_results[key].overview : value.description;

                                                                dbConfig.query(
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

                                                                dbConfig.query(
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
                                                                        new movie().detailsByTmdbId({
                                                                            tmdb_id: JSON.parse(response.body).movie_results[key].id
                                                                        });
                                                                    }
                                                                )

                                                                dbConfig.query(
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
                                        });
                                    }
                                });

                            if (movieTrailerImdbId.indexOf(data.id) === -1) {

                                new movie.trailer({
                                    originalName: value.originalname,
                                    releaseDate: value.release_date,
                                    imdbId: value.imdb_id,
                                });
                            }
                        }
                    });
            });
        });
        // });
        //});

    }
}