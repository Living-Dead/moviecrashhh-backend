const distributor = require('../distributors/output.json');
const moment = require('moment');

const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

function kebabToSnake(str) {
    var string = '';
    var chart = '';
    for (i = 0; i < str.length; i++) { //fixed spelling from 'str.lenght'

        string = string + str.charAt(i)

            .replace(/[^\d]/gi, '');

    }
    return string;
}

function distributionFormatter(str) {
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
            .toLowerCase();

    }
    return string;
}

function characterReplace(str) {
    var string = '';
    var chart = '';
    for (i = 0; i < str.length; i++) { //fixed spelling from 'str.lenght'

        string = string + str.charAt(i)

            .replace(/[^\A-Z]/gi, '');

    }
    return string;
}

function formatter(str) {
    var string = '';
    var chart = '';
    for (i = 0; i < str.length; i++) { //fixed spelling from 'str.lenght'

        string = string +
            str.charAt(i).replace(/[^\d]/gi, "");

    }
    return string;
}

var result = ''; // lives outside loop


var imdbId = [];
pool.query('SELECT imdb_id FROM distributor', (error, results) => {
    if (results.rowCount !== 0) {
        results.rows.forEach(function(value) {
            imdbId.push(value.imdb_id);
        });
    }
    distributor.forEach(function(element) {
        if (typeof element["IMDB link"] !== 'undefined' && element["IMDB link"] !== '' && element["IMDB link"] !== null) {
            //console.log(element["IMDB link"]);
            //console.log(element["Title"].replace(/\([0-9A-Z]+\)/gi, '').replace(/\[\s[A-Z]+\s\]/gi, ''));

            if (imdbId.indexOf(element["IMDB link"].replace('https://www.imdb.com/title/', '')) === -1) {
                var upRating = element["Title"].match(/\([0-9A-Z]+\)/gi);

                var artMovie = element["Title"].match(/\[\s[A-Z]+\s\]/gi);

                result = moment(formatter(element["premier"])).format("YYYY-MM-DD") > result && moment(formatter(element["premier"])).format("YYYY-MM-DD") !== 'Invalid date' ? moment(formatter(element["premier"])).format("YYYY-MM-DD") : result;
                //result += result;
                /* console.log(' ');
                 console.log('result', result);
                 console.log(element["Title"].replace(/\([0-9A-Z]+\)/gi, '').replace(/\[\s[A-Z]+\s\]/gi, ''));
                 console.log(' ');*/
                if (typeof upRating !== 'undefined' && upRating !== null && upRating !== '') {
                    console.log(kebabToSnake(upRating[0]));

                }

                if (typeof artMovie !== 'undefined' && artMovie !== null && artMovie !== '') {
                    console.log(characterReplace(artMovie[0]));

                }

                //console.log(moment(element["premier"]).format("YYYY-MM-DD"));

                pool.query(
                    'INSERT INTO distributor ( movie_name, imdb_id, distributor_name, distributor_convert_name, up_rating, art_movie_flag, date ) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                    [
                        element["Title"].replace(/\([0-9A-Z]+\)/gi, '').replace(/\[\s[A-Z]+\s\]/gi, ''),
                        element["IMDB link"].replace('https://www.imdb.com/title/', ''),
                        element["Distributor – HUN"],
                        distributionFormatter(element["Distributor – HUN"]),
                        (typeof upRating !== 'undefined' && upRating !== null && upRating !== '') ? kebabToSnake(upRating[0]) : '',
                        (typeof artMovie !== 'undefined' && artMovie !== null && artMovie !== '') ? characterReplace(artMovie[0]) : '',
                        result
                    ],
                    (error, results) => {
                        if (error) {
                            console.log('distributor INSERT: an error occured', error);
                        }
                        console.log('distributor INSERT: ok done');
                    });


            } else {
                console.log('Already up-to-date');
            }

        }
    });

});