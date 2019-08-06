const distributor = require('./output.json');

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

function characterReplace(str) {
    var string = '';
    var chart = '';
    for (i = 0; i < str.length; i++) { //fixed spelling from 'str.lenght'

        string = string + str.charAt(i)

            .replace(/[^\A-Z]/gi, '');

    }
    return string;
}

//console.log(distributor);

distributor.forEach(function(element) {
	if (typeof element["IMDB link"] !== 'undefined' && element["IMDB link"] !== '' && element["IMDB link"] !== null) {
  		console.log(element["IMDB link"]);
  		console.log(element["Title"].replace(/\([0-9A-Z]+\)/gi, '').replace(/\[\s[A-Z]+\s\]/gi, ''));
  		var upRating = element["Title"].match(/\([0-9A-Z]+\)/gi);

        var artMovie = element["Title"].match(/\[\s[A-Z]+\s\]/gi);

         /*if (typeof upRating !== 'undefined' && upRating !== null && upRating !== '') {
                            console.log(kebabToSnake(upRating[0]));
         
                        }

                        if (typeof artMovie !== 'undefined' && artMovie !== null && artMovie !== '') {
                            console.log(characterReplace(artMovie[0]));
           
                        }
                        */

                         pool.query(
                            'INSERT INTO distributor ( movie_name, imdb_id, distributor_name, up_rating, art_movie_flag ) VALUES ($1, $2, $3, $4, $5)',
                            [
                                element["Title"].replace(/\([0-9A-Z]+\)/gi, '').replace(/\[\s[A-Z]+\s\]/gi, ''),
                                element["IMDB link"].replace('https://www.imdb.com/title/', ''),
                                element["Distributor – HUN"],
                                (typeof upRating !== 'undefined' && upRating !== null && upRating !== '') ? kebabToSnake(upRating[0]) : '',
                                (typeof artMovie !== 'undefined' && artMovie !== null && artMovie !== '') ? characterReplace(artMovie[0]) : ''
                            ],
                            (error, results) => {
                                if (error) {
                                    console.log('distributor INSERT: an error occured', error);
                                }
                                console.log('distributor INSERT: ok done');

                            });

	}
});