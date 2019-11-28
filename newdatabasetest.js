const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432',
    password: 'postgres'
});

pool.query(
    'INSERT INTO test ( movie_name, imdb_id) VALUES ($1, $2)',
    [
        'testfilmnev',
        'tt1234567'
    ],
    (error, results) => {
        if (error) {
            console.log('an error occured', error);
        }
        console.log('ok done');

    });