const moment = require('moment');
const request = require('request');
const database = require('../database/update/insertFlag.update.js');
const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});
var YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');


database.updateInsertFlag({
    statement: 'UPDATE ',
    tableName: 'movie_premiers SET ',
    condition: ['insert_flag = NULL'],
});

/*
pool.query('UPDATE movie_premiers SET insert_flag = NULL;', (error, results) => {
    console.log('insert_flag: UPDATE - NULL', results);
});
*/



const RateLimiter = require('request-rate-limiter');

var limiter = new RateLimiter({
    rate: 10 // requests per interval,

        ,
    maxWaitingTime: 1500 // return errors for requests
    // that will have to wait for
    // n seconds or more. defaults
    // to 5 minutes
});

function kebabToSnake(str) {
    var string = '';
    var chart = '';
    for (i = 0; i < str.length; i++) { //fixed spelling from 'str.lenght'

        string = string + str.charAt(i)
            .replace(" ", "-")
            .replace("á", "a")
            .replace("é", "e")
            .replace("í", "i")
            .replace("ó", "o")
            .replace("ö", "o")
            .replace("ő", "o")
            .replace("ú", "u")
            .replace("ű", "u")
            .replace("ü", "u")
            .replace(/[^-!a-zA-Z0-9]/g, "")
            .toLowerCase();

    }
    return string;
}

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

var actorsUniqueId = [];
var movieImdbId = [];
var premiersImdbId = [];

var nowPlayingMoviesImdbId = [];

pool.query('SELECT imdb_id FROM now_playing_movies;', (error, nowPlayingMoviesResults) => {
    if (nowPlayingMoviesResults.rowCount !== 0) {
        nowPlayingMoviesResults.rows.forEach(function(nowPlayingMovieValue) {
            nowPlayingMoviesImdbId.push(nowPlayingMovieValue.imdb_id);
        });
    }
    pool.query('SELECT imdb_id FROM movie_premiers;', (error, premiersResults) => {
        if (premiersResults.rowCount !== 0) {
            premiersResults.rows.forEach(function(premierValue) {
                premiersImdbId.push(premierValue.imdb_id);
            });
        }
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

                pool.query('SELECT * FROM distributor ORDER BY date', (error, results) => {

                    results.rows.forEach(function(value) {
                        if (nowPlayingMoviesImdbId.indexOf(value.imdb_id) === -1) {

                            if ((moment(value.date).format("YYYY-MM-DD") > moment().add(1, 'day').format("YYYY-MM-DD")) && (moment(value.date).format("YYYY-MM-DD") <= moment().add(60, 'day').format("YYYY-MM-DD"))) {
                                //console.log(moment(value.date).format("YYYY-MM-DD"));
                                console.log(value.imdb_id);

                                request(
                                    'https://v2.sg.media-imdb.com/suggestion/t/' +
                                    value.imdb_id +
                                    '.json',
                                    function(error, response, body) {
                                        console.log('name', JSON.parse(body).d[0].l);

                                        limiter.request({
                                            url: 'https://api.themoviedb.org/3/find/' + value.imdb_id + '?api_key=64180bb269e67eeb00bd064cc9ea90d1&language=hu-HU&external_source=imdb_id',
                                        }).then(function(theMovieDb) {

                                            //if (JSON.parse(theMovieDb).movie_results[0].genre_ids.indexOf(35) === -1) {
                                            var genreX = [];

                                            for (var genreKey in JSON.parse(theMovieDb.body).movie_results[0].genre_ids) {
                                                genreX.push(
                                                    JSON.parse(theMovieDb.body).movie_results[0].genre_ids[genreKey]
                                                    .toString()
                                                    .replace('27', 'horror')
                                                    .replace('878', 'sci-fi')
                                                    .replace('53', 'thriller')
                                                    .replace('18', 'drama')
                                                    .replace('80', 'crime')
                                                    .replace('10752', 'war')
                                                    .replace('10765', 'sci-fi')
                                                    .replace('10759', 'action')
                                                    .replace('35', 'comedy')
                                                    .replace('9648', 'mistery')
                                                    .replace('37', 'western')
                                                    .replace('10749', 'romance')
                                                    .replace('28', 'action')
                                                    .replace('12', 'adventure')
                                                    .replace('16', 'animation')
                                                    .replace('10751', 'family')
                                                    .replace('10402', 'music')
                                                    .replace('36', 'history')
                                                    .replace('99', 'documentary')
                                                );
                                            }



                                            console.log('title', JSON.parse(body).d[0].l);
                                            console.log('year', JSON.parse(body).d[0].y);
                                            console.log('id', JSON.parse(body).d[0].id);
                                            //console.log('hu name', mf2[key].replace(/<a title=".*" href="\/movies.*?>/gi, '').replace('</a>', ''));
                                            //console.log('description', mf3[key].replace('<p class="desc">', ''));
                                            /*console.log(JSON.parse(theMovieDb).movie_results[0].backdrop_path);
                                            console.log('genre', genreX);
                                            console.log(JSON.parse(theMovieDb).movie_results[0].title);
                                            console.log(JSON.parse(theMovieDb).movie_results[0].id);
                                            console.log(JSON.parse(body).d[0].i.imageUrl);
                                            console.log('despcription ', JSON.parse(theMovieDb).movie_results[0].overview);
                                            */
                                            let movieDescription = '';
                                            if (typeof JSON.parse(theMovieDb.body).movie_results[0].overview !== 'undefined' && JSON.parse(theMovieDb.body).movie_results[0].overview !== '') {
                                                movieDescription = JSON.parse(theMovieDb.body).movie_results[0].overview;
                                            }

                                            if (premiersImdbId.indexOf(value.imdb_id) === -1) {

                                                pool.query(
                                                    'INSERT INTO movie_premiers (movieid, genre, tmdb_id, description, backdrop_path, original_name, imdb_id, poster_path, insert_flag, movie_name, distributor, release_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
                                                    [
                                                        value.imdb_id.replace('tt', ''),
                                                        genreX,
                                                        JSON.parse(theMovieDb.body).movie_results[0].id,
                                                        movieDescription,
                                                        JSON.parse(theMovieDb.body).movie_results[0].backdrop_path,
                                                        JSON.parse(body).d[0].l,
                                                        value.imdb_id,
                                                        JSON.parse(body).d[0].i.imageUrl,
                                                        1,
                                                        JSON.parse(theMovieDb.body).movie_results[0].title,
                                                        value.distributor_name,
                                                        value.date
                                                    ],
                                                    (error, results) => {
                                                        if (error) {
                                                            console.log('movie_premiers INSERT themoviedb - find: an error occured', error);
                                                        }
                                                        console.log('movie_premiers INSERT themoviedb - find: ok done');

                                                    });

                                            } else {
                                                pool.query(
                                                    'UPDATE movie_premiers SET insert_flag = $1 WHERE imdb_id = $2',
                                                    [
                                                        1,
                                                        value.imdb_id,
                                                    ],
                                                    (error, results) => {
                                                        if (error) {
                                                            console.log('movie_premiers insert_flag UPDATE: an error occured', error);
                                                        }
                                                        console.log('movie_premiers insert_flag UPDATE: ok done');

                                                    });
                                            }

                                            //console.log(JSON.parse(theMovieDb).movie_results[0].homepage);
                                            request(
                                                'https://api.themoviedb.org/3/movie/' + JSON.parse(theMovieDb.body).movie_results[0].id + '/credits?api_key=64180bb269e67eeb00bd064cc9ea90d1&language=en-US',
                                                function(error, response, theMovieDbMovieCredit) {
                                                    for (var key in JSON.parse(theMovieDbMovieCredit).cast) {
                                                        //console.log('character', JSON.parse(theMovieDbMovieCredit).cast[key].character);
                                                        //console.log('name', JSON.parse(theMovieDbMovieCredit).cast[key].name);
                                                        //console.log('profile_path', JSON.parse(theMovieDbMovieCredit).cast[key].profile_path);

                                                        if (actorsUniqueId.indexOf(createUniqueActorId({
                                                                name: JSON.parse(theMovieDbMovieCredit).cast[key].name,
                                                                imdbId: value.imdb_id,
                                                            })) === -1) {
                                                            pool.query(
                                                                'INSERT INTO actors (actor_name, character, movie_name, movie_imdb_id, actor_avatar_img, actor_unique_id, flag, cast_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                                                                [
                                                                    JSON.parse(theMovieDbMovieCredit).cast[key].name,
                                                                    JSON.parse(theMovieDbMovieCredit).cast[key].character,
                                                                    JSON.parse(body).d[0].l,
                                                                    JSON.parse(body).d[0].id,
                                                                    JSON.parse(theMovieDbMovieCredit).cast[key].profile_path,
                                                                    createUniqueActorId({
                                                                        name: JSON.parse(theMovieDbMovieCredit).cast[key].name,
                                                                        imdbId: value.imdb_id,
                                                                    }),
                                                                    1,
                                                                    JSON.parse(theMovieDbMovieCredit).cast[key].order
                                                                ],
                                                                (error, results) => {
                                                                    if (error) {
                                                                        console.log('actors INSERT: an error occured', error);
                                                                    }
                                                                    console.log('actors INSERT: ok done');

                                                                });
                                                        } else {
                                                            pool.query(
                                                                'UPDATE actors SET flag = $1 WHERE actor_unique_id = $2',
                                                                [
                                                                    1,
                                                                    createUniqueActorId({
                                                                        name: JSON.parse(theMovieDbMovieCredit).cast[key].name,
                                                                        imdbId: value.imdb_id,
                                                                    })
                                                                ],
                                                                (error, results) => {
                                                                    if (error) {
                                                                        console.log('now_playing_movies flag UPDATE: an error occured');
                                                                    }
                                                                    console.log('now_playing_movies flag UPDATE: ok done');
                                                                }
                                                            )

                                                            pool.query(
                                                                'UPDATE actors SET actor_avatar_img = $1 WHERE actor_unique_id = $2 AND actor_avatar_img IS NULL;',
                                                                [
                                                                    JSON.parse(theMovieDbMovieCredit).cast[key].profile_path,
                                                                    createUniqueActorId({
                                                                        name: JSON.parse(theMovieDbMovieCredit).cast[key].name,
                                                                        imdbId: value.imdb_id,
                                                                    })
                                                                ],
                                                                (error, results) => {
                                                                    if (error) {
                                                                        console.log('now_playing_movies actor_avatar_img UPDATE: an error occured');
                                                                    }
                                                                    console.log('now_playing_movies actor_avatar_img UPDATE: ok done');
                                                                }
                                                            )

                                                            pool.query(
                                                                'UPDATE actors SET character = $1 WHERE actor_unique_id = $2 AND character IS NULL;',
                                                                [
                                                                    JSON.parse(theMovieDbMovieCredit).cast[key].character,
                                                                    createUniqueActorId({
                                                                        name: JSON.parse(theMovieDbMovieCredit).cast[key].name,
                                                                        imdbId: value.imdb_id,
                                                                    })
                                                                ],
                                                                (error, results) => {
                                                                    if (error) {
                                                                        console.log('now_playing_movies character UPDATE: an error occured');
                                                                    }
                                                                    console.log('now_playing_movies character UPDATE: ok done');
                                                                }
                                                            )
                                                        }
                                                    }
                                                });
                                            /*
                                                request(
                                                    'https://api.themoviedb.org/3/movie/' + JSON.parse(theMovieDb).movie_results[0].id + '/credits?api_key=64180bb269e67eeb00bd064cc9ea90d1&language=en-US',
                                                    function(error, response, theMovieDbMovieCredit) {
                                                        for (var key in JSON.parse(theMovieDbMovieCredit).cast) {
                                                            //console.log('character', JSON.parse(theMovieDbMovieCredit).cast[key].character);
                                                            //console.log('name', JSON.parse(theMovieDbMovieCredit).cast[key].name);
                                                            //console.log('profile_path', JSON.parse(theMovieDbMovieCredit).cast[key].profile_path);

                                                            if (actorsUniqueId.indexOf(createUniqueActorId({
                                                                    name: JSON.parse(theMovieDbMovieCredit).cast[key].name,
                                                                    imdbId: value.imdb_id,
                                                                })) === -1) {
                                                                pool.query(
                                                                    'INSERT INTO actors (actor_name, character, movie_name, movie_imdb_id, actor_avatar_img, actor_unique_id, flag) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                                                                    [
                                                                        JSON.parse(theMovieDbMovieCredit).cast[key].name,
                                                                        JSON.parse(theMovieDbMovieCredit).cast[key].character,
                                                                        JSON.parse(body).d[0].l,
                                                                        JSON.parse(body).d[0].id,
                                                                        JSON.parse(theMovieDbMovieCredit).cast[key].profile_path,
                                                                        createUniqueActorId({
                                                                            name: JSON.parse(theMovieDbMovieCredit).cast[key].name,
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
                                                                    'UPDATE actors SET flag = $1 WHERE actor_unique_id = $2',
                                                                    [
                                                                        1,
                                                                        createUniqueActorId({
                                                                            name: JSON.parse(theMovieDbMovieCredit).cast[key].name,
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
                                                    });
													*/


                                            // } else {
                                            //    console.log('delete', value.movie_name);
                                            // }
                                        });

                                        if (movieImdbId.indexOf(JSON.parse(body).d[0].id) === -1) {

                                            pool.query(
                                                'INSERT INTO movie_imdb_id ( movie_name, id, flag ) VALUES ($1, $2, $3)',
                                                [
                                                    JSON.parse(body).d[0].l,
                                                    JSON.parse(body).d[0].id,
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
                                                    JSON.parse(body).d[0].id
                                                ],
                                                (error, results) => {
                                                    if (error) {
                                                        console.log('movie_imdb_id flag UPDATE: an error occured', error);
                                                    }
                                                    console.log('movie_imdb_id iflag UPDATE: ok done');
                                                }
                                            )

                                        }

                                        youTube.search(JSON.parse(body).d[0].l + ' ' + 'Official Trailer' + ' ' + moment(value.date).format("YYYY"), 2, function(error, result) {
                                            if (error) {
                                                console.log(error);
                                            } else {
                                                var trailerIds = [];
                                                for (let i = 0; i < result.items.length; i++) {
                                                    //console.log(JSON.stringify(result.items[i].id.videoId, null, 2));
                                                    //console.log(JSON.stringify(result.items[i].snippet.title, null, 2));
                                                    trailerIds.push(result.items[i].id.videoId);
                                                }

                                                pool.query(
                                                    'INSERT INTO movie_trailer (imdb_id, movie_original_name, trailer_ids) VALUES ($1, $2, $3)',
                                                    [
                                                        value.imdb_id,
                                                        JSON.parse(body).d[0].l,
                                                        trailerIds
                                                    ],
                                                    (error, results) => {
                                                        if (error) {
                                                            console.log('movie_trailer INSERT: an error occured', error);
                                                        }
                                                        console.log('movie_trailer INSERT: ok done');

                                                    });
                                            }
                                        });

                                    });
                            }
                        }

                    });
                });

            });
        });
    });
});