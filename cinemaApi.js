const request = require('request');
const moment = require('moment');
const genre = require('./config/config.js');

const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

var movies = [];

var uniqueMovieName = [];

const citemaCityGenreConfig = [
    genre.horror.toLowerCase(),
    genre.thriller.toLowerCase(),
    genre.drama.toLowerCase(),
    genre.action.toLowerCase(),
    genre.sci_fi.toLowerCase(),
    genre.crime.toLowerCase(),
    genre.mystery.toLowerCase(),
    genre.western.toLowerCase(),
];

const OMDBGenreConfig = [
    genre.horror,
    genre.thriller,
    genre.drama,
    genre.action,
    genre.sci_fi,
    genre.crime,
    genre.mystery,
    genre.western,
];

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


function getUnique(arr, comp) {

    //store the comparison  values in array
    const unique = arr.map(e => e[comp]).
    // store the keys of the unique objects
    map((e, i, final) => final.indexOf(e) === i && i)
        // eliminate the dead keys & return unique objects
        .filter((e) => arr[e]).map(e => arr[e]);

    return unique

};

var select = [];

pool.query('TRUNCATE now_playing_movies;', (error, results) => {
    console.log(results);

});

const cinemaCityDate = moment().add(1, 'days').format("YYYY-MM-DD");

request(
    'https://www.cinemacity.hu/hu/data-api-service/v1/quickbook/10102/film-events/in-cinema/1132/at-date/' + cinemaCityDate + '?attr=&lang=hu_HU',
    function(error, response, body) {
        console.log('cinemacity', body);

        JSON.parse(body).body.films.forEach(function(value) {
            value.attributeIds.forEach(function(data) {
                if (citemaCityGenreConfig.indexOf(data) !== -1) {
                    select.push({ name: value.name, imdb_name: kebabToSnake(value.name), attr: value.attributeIds });
                }
            });
        });

        getUnique(select, 'name').forEach(function(data) {
            request(
                'https://v2.sg.media-imdb.com/suggestion/' +
                kebabToSnake(data.name)
                .charAt(0)
                .toLowerCase() +
                '/' +
                kebabToSnake(data.name) +
                '.json',
                function(error, response, body) {

                    //console.log('-------', body);

                    JSON.parse(body).d.forEach(function(data2) {

                        if (data2.y >= moment().format('YYYY') - 1 && typeof data2.v !== 'undefined') {

                            request(
                                'http://www.omdbapi.com/?apikey=13b6a95b&i=' + data2.id,
                                function(error, response, body) {
                                    request(
                                        'https://api.themoviedb.org/3/movie/' + data2.id + '/external_ids?api_key=f4e6009df6f9b64f5063de615df82bf9',
                                        function(error, response, themoviedb) {

                                            //console.log('themoviedb', JSON.parse(themoviedb).id);
                                            request(
                                                'https://api.themoviedb.org/3/movie/' + JSON.parse(themoviedb).id + '/videos?api_key=f4e6009df6f9b64f5063de615df82bf9&language=en-US',
                                                function(error, response, themoviedb_videos) {


                                                    JSON.parse(themoviedb_videos).results.forEach(function(themoviedb_videos_results) {

                                                        console.log('themoviedb_videos', themoviedb_videos_results);
                                                        let trailer = [{ site: themoviedb_videos_results.site, key: themoviedb_videos_results.key, type: themoviedb_videos_results.type }];

                                                        pool.query('INSERT INTO now_playing_movies ( movie_name, imdb_id, genre, image, originalname, imdbRating, imdbvotes, themoviedb_id, trailer) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                                                            [data.name, data2.id, data.attr, data2.i.imageUrl, data2.l, JSON.parse(body).imdbRating, JSON.parse(body).imdbVotes, JSON.parse(themoviedb).id, trailer],
                                                            (error, results) => {
                                                                //console.log(error, results);
                                                                if (error) {
                                                                    console.log('an error occured');
                                                                }
                                                                console.log('ok done');

                                                            });
                                                    });
                                                });
                                        });
                                });
                        }

                    });
                });
        });
    });