const request = require('request');
const pg = require('pg');
/*const dbConfig = new pg.dbConfig({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});
*/
const dbConfig = require('../config/config.js');
const RateLimiter = require('request-rate-limiter');

const limiter = new RateLimiter({
    rate: 10 // requests per interval,

        ,
    maxWaitingTime: 1500 // return errors for requests
    // that will have to wait for
    // n seconds or more. defaults
    // to 5 minutes
});

const YouTube = require('youtube-node');
const youTube = new YouTube();
youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');
const moment = require('moment');


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



//dbConfig.query('SELECT cinema_premier_id, imdb_id, tmdb_id, originalname FROM now_playing_movies WHERE insert_flag = 1', (error, results) => {
class movie {
    detailsByImdbId(value) {

        console.log('by the imdb id', value);

        //results.rows.forEach(function(value) {

        if (typeof value.imdb_id !== 'undefined' && value.imdb_id !== '') {
            console.log(value.imdb_id);

            limiter.request({
                url: 'http://www.omdbapi.com/?apikey=13b6a95b&i=' + value.imdb_id,

            }).then(function(omdbApi) {
                /* request(
                     'http://www.omdbapi.com/?apikey=13b6a95b&i=' + value.imdb_id,
                     function(error, response, omdbApi) {*/


                dbConfig.query(
                    `UPDATE 
                        now_playing_movies 
                    SET 
                        director = $1,
                        writer = $2,
                        awards = $3
                    WHERE 
                        cinema_premier_id = $4;`,
                    [
                        JSON.parse(omdbApi.body).Director,
                        JSON.parse(omdbApi.body).Writer,
                        JSON.parse(omdbApi.body).Awards,
                        value.cinema_premier_id
                    ],
                    (error, results) => {
                        if (error) {
                            console.log('an error occured');
                        }
                        console.log('ok done');
                    }
                )

            });


        }

    }
    posterByImdbId(value) {
        if (typeof value.imdb_id !== 'undefined' && value.imdb_id !== '') {
            request(
                'https://v2.sg.media-imdb.com/suggestion/t/' + value.imdb_id + '.json',
                function(error, response, imdb) {

                    if (typeof JSON.parse(imdb).d !== 'undefined') {
                        dbConfig.query(
                            `UPDATE 
                                now_playing_movies 
                            SET 
                                image = $1 
                            WHERE 
                                cinema_premier_id = $2;`,
                            [
                                JSON.parse(imdb).d[0].i.imageUrl,
                                value.cinema_premier_id
                            ],
                            (error, results) => {
                                if (error) {
                                    console.log('now_playing_movies UPDATE poster_path: an error occured');
                                }
                                console.log('now_playing_movies UPDATE poster_path: ok done');
                            }
                        )
                    }

                });
        }
    }
    detailsByTmdbId(value) {

        console.log('by the tmdb id', value);

        limiter.request({
            url: 'https://api.themoviedb.org/3/movie/' + value.tmdb_id + '?api_key=f4e6009df6f9b64f5063de615df82bf9&language=en-US',

        }).then(function(theMovieDb) {

            dbConfig.query(
                `UPDATE 
                    now_playing_movies 
                SET
                    production = $1
                WHERE
                    tmdb_id = $2;`,
                [
                    JSON.parse(theMovieDb.body).production_companies,
                    value.tmdb_id
                ],
                (error, results) => {
                    if (error) {
                        console.log('now_playing_movies UPDATE themoviedb production: an error occured', error);
                    }
                    console.log('now_playing_movies UPDATE themoviedb production: ok done');
                    dbConfig.query(
                        `UPDATE 
                            now_playing_movies 
                        SET 
                            official_website = $1 
                        WHERE 
                            tmdb_id = $2 
                        AND 
                            official_website IS NULL;`,
                        [
                            JSON.parse(theMovieDb.body).homepage,
                            value.tmdb_id
                        ],
                        (error, results) => {
                            if (error) {
                                console.log('now_playing_movies UPDATE themoviedb official_website: an error occured', error);
                            }
                            console.log('now_playing_movies UPDATE themoviedb official_website: ok done');

                        });
                });



        });

        // });
    }
    trailer(value) {

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

                dbConfig.query(
                    `INSERT INTO 
                        movie_trailer (
                            imdb_id, 
                            original_movie_name, 
                            trailer_ids)
                    VALUES ($1, $2, $3);`,
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
    //});


}

module.exports = movie;