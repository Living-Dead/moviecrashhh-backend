const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

pool.query('UPDATE movie_premiers SET live_flag = NULL;', (error, results) => {
    console.log(results);
});

pool.query('SELECT imdb_id FROM movie_premiers WHERE insert_flag = 1', (error, results) => {

    results.rows.forEach(function(value) {
        pool.query(
            'UPDATE movie_premiers SET live_flag = 1 WHERE imdb_id = $1',
            [
            	value.imdb_id
            ],
            (error, results) => {
                if (error) {
                    console.log('an error occured');
                }
                console.log('ok done');
            }
        )

    });
});