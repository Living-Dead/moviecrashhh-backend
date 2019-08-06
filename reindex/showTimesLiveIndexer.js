const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

pool.query('UPDATE show_times SET live_show_times = NULL;', (error, results) => {
    console.log('live_show_times: UPDATE - NULL', results);
});

pool.query('SELECT show_times_id FROM show_times', (error, results) => {

    console.log(results);
    if (results.rowCount !== 0) {
    results.rows.forEach(function(value) {
        pool.query(
                    'UPDATE show_times SET live_show_times = 1 WHERE new_show_times = 1 AND show_times_id = $1',
                    [
                        value.show_times_id
                    ],
                    (error, results) => {
                        if (error) {
                            console.log('show_times UPDATE: an error occured');
                        }
                        console.log('show_times UPDATE live_show_times INSERT: ok done');
                    }
                )


    });
    }
});