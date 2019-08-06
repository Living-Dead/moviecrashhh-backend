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
/*
i: {height: 2048,…}
height: 2048
imageUrl: "https://m.media-amazon.com/images/M/MV5BMTgyMjI3ODA3Nl5BMl5BanBnXkFtZTcwNzY2MDYxOQ@@._V1_.jpg"
width: 1335
id: "nm0000233"
l: "Quentin Tarantino"
*/

pool.query('SELECT director, originalname, imdb_id FROM now_playing_movies WHERE director IS NOT NULL;', (error, results) => {
    results.rows.forEach(function(value) {
        request(
            'https://v2.sg.media-imdb.com/suggestion/names/' +
            kebabToSnake(value.director)
            .charAt(0)
            .toLowerCase() +
            '/' +
            kebabToSnake(value.director) +
            '.json',
            function(error, response, body) {
                if (typeof JSON.parse(body).d !== 'undefined') {
                    //JSON.parse(body).d.forEach(function(imdb) {
                    //var imdbDirectorSplit = [];
                    //imdbDirectorSplit = imdb.s.split(',');
                    //console.log(imdb.s.split(','));
                    if (typeof JSON.parse(body).d[0].s !== 'undefined' && JSON.parse(body).d[0].s !== '') {
                        if (typeof JSON.parse(body).d[0].s.split(',')[0] !== 'undefined' && JSON.parse(body).d[0].s.split(',')[0] !== '' && JSON.parse(body).d[0].s.split(',')[0] === 'Director') {
                            if (JSON.parse(body).d[0].l.indexOf(value.director) !== -1) {
                                if (typeof JSON.parse(body).d[0].i !== 'undefined' && JSON.parse(body).d[0].i !== '') {
                                    console.log(JSON.parse(body).d[0].l, value.director, value.originalname, JSON.parse(body).d[0].id, JSON.parse(body).d[0].i.imageUrl);

                                    pool.query(
                                        'INSERT INTO directors ( director_movie, movie_imdb_id, director_imdb_id, director_image_url, director_name, unique_id ) VALUES ( $1, $2, $3, $4, $5, $6 )',
                                        [
                                            value.originalname,
                                            value.imdb_id,
                                            JSON.parse(body).d[0].id,
                                            JSON.parse(body).d[0].i.imageUrl,
                                            value.director,
                                            createUniqueActorId({
                                                name: value.director,
                                                imdbId: value.imdb_id,
                                            })
                                        ],
                                        (error, results) => {
                                            if (error) {
                                                console.log('director INSERT: an error occured', error);
                                            }
                                            console.log('director INSERT: ok done');

                                        });
                                }
                            }
                        }
                    }
                    /*if (imdb.l === value.director) {
	                    	console.log('imdb', imdb.l);
	                    	console.log('director', value.director);
	                	}*/
                    //});
                }
            });
    });
});