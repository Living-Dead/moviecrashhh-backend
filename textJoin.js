/*const h = [
require('./nowPlayingMovies/firstCinemaPremierMainApiCallFree.js'),
require('./nowPlayingMovies/secondCinemaPremierMovieApiCall.js')
];

function run() {
    for (let k in h) {
        h[k];
    }

}
*/

const cinemaHelpers = require('./common/helpers/cinema.helpers.js');
let x = new cinemaHelpers();
console.log(x.imdbSearchFormat('Áálj áká'));



const request = require('request');
var RateLimiter = require('request-rate-limiter');
const bcrypt = require('bcrypt');
const moment = require('moment');
var YouTube = require('youtube-node');
const database = require('../database/update/insertFlag.update.js');

var youTube = new YouTube();
youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

var limiter = new RateLimiter({
    rate: 10 // requests per interval,

        ,
    maxWaitingTime: 1500 // return errors for requests
    // that will have to wait for
    // n seconds or more. defaults
    // to 5 minutes
});
const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

/*pool.query('TRUNCATE actors;', (error, results) => {
    console.log(results);

});
*/

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



var actorsUniqueId = [];
var movieImdbId = [];
pool.query('SELECT id FROM movie_imdb_id;', (error, movieImdbIdResults) => {
    if (movieImdbIdResults.rowCount !== 0) {
        movieImdbIdResults.rows.forEach(function(movieImdbIdValue) {
            movieImdbId.push(movieImdbIdValue.id);
        });
    }
    pool.query('SELECT actor_unique_id FROM actors;', (error, actorResults) => {
        if (actorResults.rowCount !== 0) {
            actorResults.rows.forEach(function(actorValue) {
                actorsUniqueId.push(actorValue.actor_unique_id);
            });
        }

        pool.query('SELECT originalname, cinema_premier_id, movie_name, imdb_id, description, release_date FROM now_playing_movies WHERE insert_flag = 1;', (error, results) => {

            results.rows.forEach(function(value) {

                request(
                    'https://mozipremierek.hu/api/movie/' + value.cinema_premier_id,
                    function(error, response, cinemaPremierDataOnShow) {
                        if (typeof value.imdb_id !== 'undefined' && value.imdb_id !== '' && value.imdb_id !== null) {
                            for (var actor in JSON.parse(cinemaPremierDataOnShow).actors) {
                                console.log(JSON.parse(cinemaPremierDataOnShow).actors[actor].name, value.cinema_premier_id);
                                if (typeof JSON.parse(cinemaPremierDataOnShow).actors[actor].imdb_id !== 'undefined' && JSON.parse(cinemaPremierDataOnShow).actors[actor].imdb_id !== '') {
                                    // (typeof JSON.parse(cinemaPremierDataOnShow).actors[actor].imdb_id !== 'undefined' && JSON.parse(cinemaPremierDataOnShow).actors[actor].imdb_id !== '')
                                    if (actorsUniqueId.indexOf(createUniqueActorId({
                                            name: JSON.parse(cinemaPremierDataOnShow).actors[actor].name,
                                            imdbId: value.imdb_id,
                                        })) === -1) {
                                        pool.query(
                                            'INSERT INTO actors (actor_name, cinema_premier_id, imdb_id, movie_name, movie_imdb_id, actor_unique_id, flag) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                                            [
                                                JSON.parse(cinemaPremierDataOnShow).actors[actor].name,
                                                value.cinema_premier_id,
                                                JSON.parse(cinemaPremierDataOnShow).actors[actor].imdb_id,
                                                value.originalname,
                                                value.imdb_id,
                                                createUniqueActorId({
                                                    name: JSON.parse(cinemaPremierDataOnShow).actors[actor].name,
                                                    imdbId: value.imdb_id,
                                                }),
                                                1
                                            ],
                                            (error, results) => {
                                                if (error) {
                                                    console.log('actors INSERT: an error occured', error);
                                                }
                                                console.log('actors INSERT: ok done');

                                            });
                                    } else {

                                        pool.query(
                                            'UPDATE actors SET imdb_id = $1, flag = $2, cinema_premier_id = $3 WHERE actor_unique_id = $4;',
                                            [
                                                JSON.parse(cinemaPremierDataOnShow).actors[actor].imdb_id,
                                                1,
                                                value.cinema_premier_id,
                                                createUniqueActorId({
                                                    name: JSON.parse(cinemaPremierDataOnShow).actors[actor].name,
                                                    imdbId: value.imdb_id,
                                                })
                                            ],
                                            (error, results) => {
                                                if (error) {
                                                    console.log('now_playing_movies imdb_id INSERT: an error occured');
                                                }
                                                console.log('now_playing_movies imdb_id INSERT: ok done');
                                            }
                                        )
                                    }
                                }
                            }


                            pool.query(
                                'UPDATE now_playing_movies SET imdb_id = $1 WHERE cinema_premier_id = $2 AND imdb_id IS NULL;',
                                [
                                    JSON.parse(cinemaPremierDataOnShow).imdb_id,
                                    value.cinema_premier_id
                                ],
                                (error, results) => {
                                    if (error) {
                                        console.log('now_playing_movies imdb_id INSERT: an error occured');
                                    }
                                    console.log('now_playing_movies imdb_id INSERT: ok done');
                                }
                            )

                            if (movieImdbId.indexOf(JSON.parse(cinemaPremierDataOnShow).imdb_id) === -1) {

                                pool.query(
                                    'INSERT INTO movie_imdb_id ( movie_name, id, flag ) VALUES ($1, $2, $3)',
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
                                pool.query(
                                    'UPDATE movie_imdb_id SET flag = $1 WHERE id = $2',
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


                            limiter.request({
                                url: 'https://api.themoviedb.org/3/find/' + JSON.parse(cinemaPremierDataOnShow).imdb_id + '?api_key=f4e6009df6f9b64f5063de615df82bf9&language=hu-HU&external_source=imdb_id',
                            }).then(function(response) {
                                //console.log(response);

                                for (var key in JSON.parse(response.body).movie_results) {
                                    //console.log(JSON.parse(response.body).movie_results[key].backdrop_path);
                                    var overview = typeof JSON.parse(response.body).movie_results[key].overview !== 'undefined' &&
                                        JSON.parse(response.body).movie_results[key].overview !== '' ? JSON.parse(response.body).movie_results[key].overview : value.description;

                                    /* if (typeof JSON.parse(response.body).movie_results[key].poster_path !== 'undefined' &&
                                         JSON.parse(response.body).movie_results[key].poster_path !== '') {
                                         pool.query(
                                             'UPDATE now_playing_movies SET image = $1 WHERE cinema_premier_id = $2',
                                             [
                                                 JSON.parse(response.body).movie_results[key].poster_path,
                                                 value.cinema_premier_id
                                             ],
                                             (error, results) => {
                                                 if (error) {
                                                     console.log('now_playing_movies UPDATE poster_path: an error occured');
                                                 }
                                                 console.log('now_playing_movies UPDATE poster_path: ok done');
                                             }
                                         )
                                     }*/

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

                                    /*pool.query(
                                        'UPDATE now_playing_movies SET backdrop_path = $1, description = $2, tmdb_id = $3 WHERE cinema_premier_id = $4 AND backdrop_path IS NULL;',
                                        [
                                            'https://image.tmdb.org/t/p/original/' + JSON.parse(response.body).movie_results[key].backdrop_path,
                                            overview,
                                            JSON.parse(response.body).movie_results[key].id,
                                            value.cinema_premier_id
                                        ],
                                        (error, results) => {
                                            if (error) {
                                                console.log('now_playing_movies UPDATE backdrop_path: an error occured');
                                            }
                                            console.log('now_playing_movies UPDATE backdrop_path: ok done');
                                        }
                                    )*/
                                }
                            });
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

                                    //console.log('-------', body);

                                    // q === 'feature'
                                    // y === year
                                    if (typeof JSON.parse(body).d !== 'undefined') {

                                        JSON.parse(body).d.forEach(function(data) {
                                            console.log('year', data.y);

                                            if (data.y === parseInt(moment(value.release_date).format('YYYY')) && data.q === 'feature') {
                                                pool.query(
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
                                                    }
                                                )
                                                if (movieImdbId.indexOf(data.id) === -1) {

                                                    pool.query(
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
                                                    pool.query(
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



                                                for (var actor in JSON.parse(cinemaPremierDataOnShow).actors) {
                                                    console.log(JSON.parse(cinemaPremierDataOnShow).actors[actor].name, value.cinema_premier_id);
                                                    if (typeof JSON.parse(cinemaPremierDataOnShow).actors[actor].imdb_id !== 'undefined' && JSON.parse(cinemaPremierDataOnShow).actors[actor].imdb_id !== '') {
                                                        // (typeof JSON.parse(cinemaPremierDataOnShow).actors[actor].imdb_id !== 'undefined' && JSON.parse(cinemaPremierDataOnShow).actors[actor].imdb_id !== '')
                                                        if (actorsUniqueId.indexOf(createUniqueActorId({
                                                                name: JSON.parse(cinemaPremierDataOnShow).actors[actor].name,
                                                                imdbId: data.id,
                                                            })) === -1) {
                                                            pool.query(
                                                                'INSERT INTO actors (actor_name, cinema_premier_id, imdb_id, movie_name, movie_imdb_id, actor_unique_id, flag) VALUES ($1, $2, $3, $4, $5, $6, $7);',
                                                                [
                                                                    JSON.parse(cinemaPremierDataOnShow).actors[actor].name,
                                                                    value.cinema_premier_id,
                                                                    JSON.parse(cinemaPremierDataOnShow).actors[actor].imdb_id,
                                                                    value.originalname,
                                                                    data.id,
                                                                    createUniqueActorId({
                                                                        name: JSON.parse(cinemaPremierDataOnShow).actors[actor].name,
                                                                        imdbId: data.id,
                                                                    }),
                                                                    1
                                                                ],
                                                                (error, results) => {
                                                                    if (error) {
                                                                        console.log('actors INSERT: an error occured', error);
                                                                    }
                                                                    console.log('actors INSERT: ok done');

                                                                });
                                                        } else {

                                                            pool.query(
                                                                'UPDATE actors SET imdb_id = $1, flag = $2, cinema_premier_id = $3 WHERE actor_unique_id = $4;',
                                                                [
                                                                    JSON.parse(cinemaPremierDataOnShow).actors[actor].imdb_id,
                                                                    1,
                                                                    value.cinema_premier_id,
                                                                    createUniqueActorId({
                                                                        name: JSON.parse(cinemaPremierDataOnShow).actors[actor].name,
                                                                        imdbId: data.id,
                                                                    })
                                                                ],
                                                                (error, results) => {
                                                                    if (error) {
                                                                        console.log('now_playing_movies imdb_id INSERT: an error occured');
                                                                    }
                                                                    console.log('now_playing_movies imdb_id INSERT: ok done');
                                                                }
                                                            )

                                                        }
                                                    }
                                                }
                                            }

                                        });
                                    }
                                });

                        }

                        /*
                        youTube.search(value.originalname + ' ' + 'Official Trailer' + ' ' + moment(value.release_date).format("YYYY"), 2, function(error, result) {
                            if (error) {
                                console.log(error);
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
                                        JSON.parse(cinemaPremierDataOnShow).imdb_id,
                                        value.originalname,
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
                        */
                    });
            });
        });
    });
});