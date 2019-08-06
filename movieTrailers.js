var HTMLParser = require('node-html-parser');
const request = require('request');
const pg = require('pg');

const cinema = require('./cinemacity.json');

const moment = require('moment');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

var arr = [];
var arr2 = [];
var sss = [];
var release_date = '';

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


pool.query('SELECT cinema_premier_id, originalname FROM now_playing_movies', (error, results) => {



    results.rows.forEach(function(value) {
        //console.log(value.cinema_premier_id);


        //console.log(x.id);

        request(
            'https://mozipremierek.hu/api/movie/' + value.cinema_premier_id,
            function(error, response, c) {


                //console.log('----', JSON.parse(c).trailers);
                //let trailer = x.id + ':trailers';
                var array = [];
                for (var k in JSON.parse(c).trailers) {

                    if (JSON.parse(c).trailers.hasOwnProperty(k)) {

                        array.push(JSON.parse(c).trailers[k].url);
                        // console.log(JSON.parse(c).trailers[k].url, value.cinema_premier_id, array);
                        pool.query(


                            'UPDATE now_playing_movies SET trailer = $1 WHERE cinema_premier_id = $2',
                            [array, value.cinema_premier_id],
                            (error, results) => {
                                if (error) {
                                    console.log('an error occured');
                                }
                                console.log('ok done');
                            }
                        )
                    }
                }

            });
    });

});

/*
            pool.query(


                'UPDATE now_playing_movies SET trailer = $1 WHERE cinema_premier_id = $2',
                [x.url, parseInt(x.movie_id)],
                (error, results) => {
                    if (error) {
                       // console.log('an error occured');
                    }
                    //console.log('ok done');
                }
            )

        });
*/


/*
                    request(
                        'https://mozipremierek.hu/api/movie/' + value.cinema_premier_id,
                        function(error, response, cinema) {
                            //console.log(JSON.parse(cinema).trailers);

                            JSON.parse(cinema).trailers.forEach(function(value2) {
                                console.log(value2);

                            });
                    });
                    */




/*
const cinema = require('./cinemacity.json');
//const html = require('./omdb_api.html');




cinema.data.trailers.forEach(function(x) {

    pool.query(


        'UPDATE now_playing_movies SET trailer = $1 WHERE cinema_premier_id = $2',
        [x.url, x.movie_id],
        (error, results) => {
            if (error) {
                console.log('an error occured');
            }
            console.log('ok done');
        }
    )

});
*/