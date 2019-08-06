const express = require('express');
const session = require('express-session');
const app = express();
const port = 8080;
const uuid = require('uuid/v4');
const moment = require('moment');

const listJSON = require('./list.json');

const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

// files
const bcrypt = require('bcrypt');
const passwordBcrypt = require('./bcrypt/passwordBcrypt');
const crypt = new passwordBcrypt();


app.use(function(req, res, next) {
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    //res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.set('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.json());

app.options('*', function(req, res) {
    res.send('OK');
});

app.get('/list', (req, res) => {

    res.json(listJSON);
});



app.get('/now_playing', (req, res) => {

    pool.query('SELECT * FROM tv_series JOIN movie_imdb_id ON tv_series.imdb_id = movie_imdb_id.id LEFT JOIN movie_trailer ON movie_trailer.imdb_id = tv_series.imdb_id ORDER BY tv_series.release_date', (error, results1) => {

          pool.query('SELECT *, now_playing_movies.movie_name AS movie_name, now_playing_movies.imdb_id AS imdb_id FROM now_playing_movies LEFT JOIN movie_imdb_id ON now_playing_movies.imdb_id = movie_imdb_id.id LEFT JOIN distributor ON distributor.imdb_id = now_playing_movies.imdb_id LEFT JOIN movie_trailer ON movie_trailer.imdb_id = now_playing_movies.imdb_id WHERE now_playing_movies.live_flag = 1 ORDER BY now_playing_movies.release_date', (error, results) => {

            pool.query('SELECT *, movie_premiers.movie_name AS movie_name FROM movie_premiers LEFT JOIN movie_imdb_id ON movie_premiers.imdb_id = movie_imdb_id.id LEFT JOIN distributor ON distributor.imdb_id = movie_premiers.imdb_id LEFT JOIN movie_trailer ON movie_trailer.imdb_id = movie_premiers.imdb_id WHERE movie_premiers.live_flag = 1 ORDER BY movie_premiers.release_date', (error, results2) => {

        res.json({
            now_playing: {
                movies: results.rows,
                message: true,
            },
             tv_series: {
                movies: results1.rows,
                message: true,
            },
             premiers: {
                 movies: results2.rows,
                 message: true,
             }

        });
           });

    });
              });
});


app.get('/academy_award_winners', (req, res) => {

    /*    SELECT  *
    FROM    maintable m
    JOIN    othertable o
    ON      o.parentId = m.id
    UNION
    SELECT  *
    FROM    maintable m
    JOIN    othertable o
    ON      o.id = m.parentId
    */

    pool.query('SELECT category_name, academy_img, nominee_name, academy_year, post_title, hu_award_title FROM academy_award_winners', (error, results) => {
        //console.log('error',results, error);

        res.json({
            academy_award_winners: {
                winners: results.rows,
                message: true,
            }
        });

    });
});


/*app.post('/actors', (req, res) => {
    console.log('--------', req.body.cinema_premier_id);

    var actors = [];


    pool.query('SELECT DISTINCT * FROM actors WHERE cinema_premier_id = $1', [req.body.cinema_premier_id], (error, results) => {
        //console.log('error',results.rows);

        if (typeof results !== 'undefined' && results.rows !== '') {
        res.json({

            actors: results.rows,
            message: true,

        });
    }

    });
});*/

app.post('/show_times', (req, res) => {
    console.log('shoooow', req.body)
    var queryID = req.body.cinema_premier_id;
    console.log('--------', req.body.cinema_premier_id);
    var data = [];
    var actors = [];
     var distributor = [];
     var directors = [];


    pool.query('SELECT director_imdb_id, director_image_url, director_id FROM directors WHERE movie_imdb_id = $1', [req.body.imdb_id], (error, results) => {
        //console.log('error',results.rows);

        results.rows.forEach(function(value) {
            
                directors.push({
                    director_id: value.director_id,
                    director_image_url: value.director_image_url,
                    director_imdb_id: value.director_imdb_id,
                });
            
        });

    pool.query('SELECT cast_order, actor_avatar_img, actor_name, imdb_id, character, episode FROM actors WHERE cinema_premier_id = $1 OR movie_imdb_id = $2 ORDER BY cast_order', [req.body.cinema_premier_id, req.body.imdb_id], (error, results1) => {
        //console.log('error',results.rows);

        results1.rows.forEach(function(value) {
            
                actors.push({
                    actor_avatar_img: value.actor_avatar_img,
                    actor_name: value.actor_name,
                    imdb_id: value.imdb_id,
                    character: value.character,
                    episode: value.episode,
                    cast_order: value.cast_order,
                });
            
        });

        pool.query('SELECT * FROM show_times WHERE cinema_premier_id = $1', [queryID], (error, results2) => {
            //console.log('error',results.rows);

            results2.rows.forEach(function(value) {

                //console.log(value.date);

                // if(moment(value.date).format("YYYY-MM-DD") ==  moment().add(1, 'days').format("YYYY-MM-DD")) {

                //console.log(value.city, value.date);

                data.push({ city: value.city, cinema_name: value.cinema_name, date: value.date, showtimes: value.showtimes, cinema_name: value.cinema_name });

            });

            /*  pool.query('SELECT * FROM distributor WHERE imdb_id = $1', [req.body.imdb_id], (error, results3) => {
            //console.log('error',results.rows);

            results3.rows.forEach(function(value3) {
                distributor.push({
                    distributor_name: value3.distributor_name,
                    movie_name: value3.movie_name,
                    up_rating: value3.up_rating,
                    art_movie_flag: value3.art_movie_flag,
                });

            });*/

           // console.log(data);
            res.json({
                show_times: data,
                actors: actors,
                directors: directors,
               // distributor: distributor,
                message: true,

            });
            //  }
       // });

    });


        });

    });
});

app.get('/coming_soon_comic_books', (req, res) => {

    pool.query('SELECT * FROM cooming_soon_comic_books ORDER BY date', (error, results) => {
        //console.log('results error',results, error);


        res.json({
            cooming_soon_comic_books: {
                comic_books: results.rows,
                message: true,
            }
        });

    });
});

app.use(session({
    name: 'moviecrashhh_session',
    secret: 'test',
    resave: false,
    saveUnitialized: true,
    cookie: {
        httpOnly: false,
        maxAge: 100000,
    }
}));

app.post('/login', function(req, res) {
    //var cookieDate = new Date(moment().add(1.020, 'hours').toDate());

    //req.session.cookie.expires = cookieDate;

    req.session.email = req.body.email;
    //console.log('email session login', req.session);
    //console.log('email session login', req.sessionID);

    pool.query('SELECT * FROM users WHERE email = $1', [req.body.email], (error, results) => {
        console.log('error',results, error);

        if (typeof results === 'undefined') {
            //console.log(results, error);
            //console.log(error);
            res.json({
                ok: false,
                success: false,
                message: 'Nem megfelelo email/jelszo',
            });
        } else {
            //console.log(results, error);
            if (results.rows[0]) {
                bcrypt.compare(req.body.password, results.rows[0].password, function(err, response) {
                    // res == false
                    let user = results.rows[0];
                    console.log('user', user);
                    delete user.password;

                    console.log('response', response);

                    if (response) {

                        // call db and validation user
                        req.session.user = {
                            uuid: uuid(),
                            user: results.rows[0],
                            date: moment().add(3, 'hours').format(),
                        };

                        res.status(200).json({
                            ok: true,
                            success: true,
                            message: 'Sikeres bejelentkezés',
                            params: req.session.user,
                        });
                    } else {
                        res.json({
                            ok: false,
                            success: false,
                            message: 'Nem megfelelo jelszo',
                        });
                    }
                });
            } else {
                res.json({
                    ok: false,
                    success: false,
                    message: 'Nem megfelelo email/jelszo',
                });
            }
        }
    });
});

app.post('/register', function(req, res) {

    ssn = req.body;
    let realname = ssn.lastName + '' + ssn.firstName;
    //console.log('REGISTER', ssn);

    let hash = bcrypt.hashSync(req.body.password, 10);

    pool.query('INSERT INTO users (name, email, password, realname) VALUES ($1, $2, $3, $4)',
        [ssn.name, ssn.email, hash, realname],
        (error, results) => {
            //console.log(error, results);
            if (error) {
                console.log('an error occured');
            }
            res.json({
                ok: true,
                success: true,
                message: 'Sikeres reg',
            });
            pool.end();
        })
});

app.get('/account', (req, res) => {

    // console.log('----email session account-----', req.session);
    // console.log('email session account', req.sessionID);

    if (req.session.email && typeof req.session.email !== 'undefined') {
        //console.log('item is logged in', myValue);
        res.json({
            account: {
                user: req.session.user,
                isLoggedIn: true,
            }
        });
    } else {
        res.json({
            account: {
                isLoggedIn: false,
            }
        });
    }
});

app.post('/logout', (req, res) => {

    // console.log('session destroy', req.session);
    //req.session.destroy();
    //delete req.session;
    req.session.destroy(function(err) {
        //   console.log('session destroy', req.session);
        res.json({
            success: true,
        });
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))