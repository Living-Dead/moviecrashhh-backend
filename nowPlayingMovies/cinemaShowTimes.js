const request = require('request');
var RateLimiter = require('request-rate-limiter');
const bcrypt = require('bcrypt');
//const moment = require('moment');
const pg = require('pg');

//const cinema = require('./test.json');

const moment = require('moment');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

var limiter = new RateLimiter({
    rate: 5 // requests per interval,

        ,
    maxWaitingTime: 1200 // return errors for requests
    // that will have to wait for
    // n seconds or more. defaults
    // to 5 minutes
});

var arr = [];
var arr2 = [];
var sss = [];
var release_date = '';

const makeUniqueId = (length) => {
              let result = '';
              const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
              const charactersLength = characters.length;
              for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
              }
              return result;
            };

function uniqueShowTimesId(object) {
    var create = kebabToSnake(object.movieName) + object.date + makeUniqueId(5);
    console.log('----', create, bcrypt.hashSync(create, 15).toString());
    return create;
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


function getUnique(arr, comp) {

    //store the comparison  values in array
    const unique = arr.map(e => e[comp]).
    // store the keys of the unique objects
    map((e, i, final) => final.indexOf(e) === i && i)
        // eliminate the dead keys & return unique objects
        .filter((e) => arr[e]).map(e => arr[e]);

    return unique

};

pool.query('UPDATE show_times SET new_show_times = NULL;', (error, results) => {
    console.log('new_show_times: UPDATE - NULL', results);
});
/*

pool.query('SELECT show_times_id FROM show_times', (error, results) => {

    console.log(results);
    if (results.rowCount !== 0) {
    results.rows.forEach(function(value) {
        pool.query(
                    'UPDATE show_times SET old_show_times = 1 WHERE live_show_times = 1 AND show_times_id = $1',
                    [
                        value.id
                    ],
                    (error, results) => {
                        if (error) {
                            console.log('show_times UPDATE: an error occured');
                        }
                        console.log('show_times UPDATE: ok done');
                    }
                )


    });
    }
});
*/

//console.log(cinema['2019-05-10'].mozik);


function characterReplace(str) {
    var string = '';
    var chart = '';
    for (i = 0; i < str.length; i++) { //fixed spelling from 'str.lenght'

        string = string + str.charAt(i)
            .replace(" ", "_")
            .toLowerCase();

    }
    return string;
}


pool.query('SELECT cinema_premier_id, originalname FROM now_playing_movies WHERE insert_flag = 1', (error, results) => {



    results.rows.forEach(function(value) {
        console.log(value.cinema_premier_id);

        limiter.request({
                url: 'https://mozipremierek.hu/api/showtimes/20190712/' + value.cinema_premier_id,

            }).then(function(cinema) {
        /*request(
            'https://mozipremierek.hu/api/showtimes/20190712/' + value.cinema_premier_id,
            function(error, response, cinema) {
                */



                for (var k in JSON.parse(cinema.body)) {
                //    for (let i = 0; i<=7; i++) {
                    //if (k == moment().add(i, 'days').format("YYYY-MM-DD")) {

                        for (var city in JSON.parse(cinema.body)[k].mozik) {
                            //console.log(cinema['2019-05-10'].mozik[k11]);
                            for (var k22 in JSON.parse(cinema.body)[k].mozik[city]) {
                                //console.log(cinema['2019-05-10'].mozik[k11][k22]);
                                //console.log(cinema['2019-05-10'].mozik[k11][k22].name);

                                for (var k33 in JSON.parse(cinema.body)[k].mozik[city][k22].showtimes) {
                                    //console.log('k33', k33);
                                    //console.log('k33', cinema['2019-05-10'].mozik[k11][k22].showtimes[k33]);

                                    for (var k44 in JSON.parse(cinema.body)[k].mozik[city][k22].showtimes[k33]) {
                                        console.log('---DATE----', k);
                                        console.log('---city---', city);
                                        console.log('name', JSON.parse(cinema.body)[k].mozik[city][k22].name);
                                        console.log('k44 time', JSON.parse(cinema.body)[k].mozik[city][k22].showtimes[k33][k44].time);
                                        console.log('k44 movie id', JSON.parse(cinema.body)[k].mozik[city][k22].showtimes[k33][k44].movie_id);
                                        var create = kebabToSnake(value.originalname) + k + makeUniqueId(8);
                                        pool.query(
                                            'INSERT INTO show_times ( cinema_premier_id, city, showtimes, cinema_name, date, show_times_id, new_show_times ) VALUES ( $1, $2, $3, $4, $5, $6, $7 )',
                                            [
                                                JSON.parse(cinema.body)[k].mozik[city][k22].showtimes[k33][k44].movie_id,
                                                city,
                                                [JSON.parse(cinema.body)[k].mozik[city][k22].showtimes[k33][k44].time],
                                                JSON.parse(cinema.body)[k].mozik[city][k22].name,
                                                k,
                                                characterReplace(city) + '_' + characterReplace(k) + '_' + characterReplace(JSON.parse(cinema.body)[k].mozik[city][k22].name) + '_' + characterReplace(JSON.parse(cinema.body)[k].mozik[city][k22].showtimes[k33][k44].time) + '_' + characterReplace(value.originalname),
                                                1
                                            ],
                                            (error, results) => {
                                                if (error) {
                                                    console.log('an error occured', error);
                                                }
                                                console.log('show_times INSERT: ok done');

                                            });
                                    }
                                }
                            }
                        }
                    //}
              //  }
                }
            });
    });
});


