const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

pool.query('UPDATE now_playing_movies SET live_flag = NULL;', (error, results) => {
    console.log(results);
});

pool.query('SELECT cinema_premier_id FROM now_playing_movies WHERE insert_flag = 1', (error, results) => {

    results.rows.forEach(function(value) {
        pool.query(
            'UPDATE now_playing_movies SET live_flag = 1 WHERE cinema_premier_id = $1',
            [
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
});