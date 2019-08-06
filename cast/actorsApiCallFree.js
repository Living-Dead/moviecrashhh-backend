const request = require('request');
const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

var RateLimiter = require('request-rate-limiter');

var limiter = new RateLimiter({
    rate: 19 // requests per interval,

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

setTimeout(function(){

var actorsUniqueId = [];
pool.query('SELECT actor_unique_id FROM actors;', (error, actorResults) => {
    if (actorResults.rowCount !== 0) {
        actorResults.rows.forEach(function(actorValue) {
            actorsUniqueId.push(actorValue.actor_unique_id);
        });
    }

pool.query('SELECT * FROM now_playing_movies WHERE insert_flag = 1 AND tmdb_id IS NOT NULL;', (error, results) => {
            results.rows.forEach(function(value) {

       
                        console.log(value.tmdb_id);

                        limiter.request({
                            url: 'https://api.themoviedb.org/3/movie/' + value.tmdb_id + '/credits?api_key=64180bb269e67eeb00bd064cc9ea90d1&language=en-US',
                        }).then(function(theMovieDbMovieCredit) {

                            console.log('-----');

                            //request(
                            //   'https://api.themoviedb.org/3/movie/' + value.tmdb_id + '/credits?api_key=64180bb269e67eeb00bd064cc9ea90d1&language=en-US',
                            //   function(error, response, theMovieDbMovieCredit.body) {
                            for (var key in JSON.parse(theMovieDbMovieCredit.body).cast) {

                                //console.log('character', JSON.parse(theMovieDbMovieCredit.body).cast[key].character);
                                console.log('name', JSON.parse(theMovieDbMovieCredit.body).cast[key].name);
                                //console.log('profile_path', JSON.parse(theMovieDbMovieCredit.body).cast[key].profile_path);

                                if (actorsUniqueId.indexOf(createUniqueActorId({
                                        name: JSON.parse(theMovieDbMovieCredit.body).cast[key].name,
                                        imdbId: value.imdb_id,
                                    })) === -1) {
                                     console.log('---unique--');
                                    pool.query(
                                        'INSERT INTO actors (actor_name, character, movie_name, movie_imdb_id, actor_avatar_img, actor_unique_id, flag, cast_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                                        [
                                            JSON.parse(theMovieDbMovieCredit.body).cast[key].name,
                                            JSON.parse(theMovieDbMovieCredit.body).cast[key].character,
                                            value.originalname,
                                            value.imdb_id,
                                            JSON.parse(theMovieDbMovieCredit.body).cast[key].profile_path,
                                            createUniqueActorId({
                                                name: JSON.parse(theMovieDbMovieCredit.body).cast[key].name,
                                                imdbId: value.imdb_id,
                                            }),
                                            1,
                                            JSON.parse(theMovieDbMovieCredit.body).cast[key].order
                                        ],
                                        (error, results) => {
                                            if (error) {
                                                console.log('actors INSERT: an error occured', error);
                                            }
                                            console.log('actors INSERT: ok done');

                                        });
                                } else {
                                    console.log('ELSE');
                                    pool.query(
                                        'UPDATE actors SET flag = $1 WHERE actor_unique_id = $2',
                                        [
                                            1,
                                            createUniqueActorId({
                                                name: JSON.parse(theMovieDbMovieCredit.body).cast[key].name,
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
                                            JSON.parse(theMovieDbMovieCredit.body).cast[key].profile_path,
                                            createUniqueActorId({
                                                name: JSON.parse(theMovieDbMovieCredit.body).cast[key].name,
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
                                            JSON.parse(theMovieDbMovieCredit.body).cast[key].character,
                                            createUniqueActorId({
                                                name: JSON.parse(theMovieDbMovieCredit.body).cast[key].name,
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
    });
            });
      });
                 
              }, 11000);   

                    /* if (value.imdb_id !== null && value.imdb_id !== 'N/A' && value.imdb_id !== 'undefined') {

                         request('https://v2.sg.media-imdb.com/suggestion/n/' +
                             value.imdb_id +
                             '.json',
                             function(error, response, actorIMDB) {
                                 console.log(actorIMDB);

                                 if (typeof JSON.parse(actorIMDB).d !== 'undefined') {

                                     console.log(JSON.parse(actorIMDB).d[0]);
                                     if (typeof JSON.parse(actorIMDB).d[0].i !== 'undefined') {
                                         //actorFromImdb.push({name: array[actor], id:value.cinema_premier_id});

                                         pool.query(
                                             'UPDATE actors SET actor_avatar_img = $1 WHERE imdb_id = $2 AND actor_avatar_img IS NULL',
                                             [
                                                 JSON.parse(actorIMDB).d[0].i.imageUrl,
                                                 value.imdb_id
                                             ],
                                             (error, results) => {
                                                 if (error) {
                                                     console.log('an error occured');
                                                 }
                                                 console.log('ok done');
                                             }
                                         )
                                     } else {
                                         console.log('error');
                                     }
                                 }
                             });
                             */

                    /*
                    limiter.request({
                        url: 'https://api.themoviedb.org/3/find/' + value.imdb_id + '?api_key=f4e6009df6f9b64f5063de615df82bf9&language=en-US&external_source=imdb_id',
                    }).then(function(response) {
                        console.log(response.body);
                        // for (var person in JSON.parse(response.body).person_results) {
                        if (JSON.parse(response.body).person_results !== '' && typeof JSON.parse(response.body).person_results !== 'undefined') {
                            request('https://api.themoviedb.org/3/person/' + JSON.parse(response.body).person_results[0].id + '/movie_credits?api_key=f4e6009df6f9b64f5063de615df82bf9&language=en-US',
                                function(error, response, theMovieDb) {
                                    if (JSON.parse(theMovieDb).cast !== '' && typeof JSON.parse(theMovieDb).cast !== 'undefined') {
                                        for (var char in JSON.parse(theMovieDb).cast) {
                                            console.log(JSON.parse(theMovieDb).cast[char].character);
                                            console.log(JSON.parse(theMovieDb).cast[char].title);

                                            if (JSON.parse(theMovieDb).cast[char].title === value.movie_name) {
                                                pool.query(
                                                    'UPDATE actors SET character = $1 WHERE imdb_id = $2 AND movie_name = $3 AND character IS NULL',
                                                    [
                                                        JSON.parse(theMovieDb).cast[char].character,
                                                        value.imdb_id,
                                                        value.movie_name
                                                    ],
                                                    (error, results) => {
                                                        if (error) {
                                                            console.log('an error occured');
                                                        }
                                                        console.log('ok done');
                                                    }
                                                )
                                            }
                                        }
                                    }
                                });
                        }
                    });
                    */
           