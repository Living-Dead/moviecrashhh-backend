const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

pool.query('SELECT show_times_id FROM show_times WHERE old_show_times = 1', (error, results) => {

    console.log(results);
    if (results.rowCount !== 0) {
        results.rows.forEach(function(value) {
            pool.query('DELETE FROM show_times WHERE show_times_id = $1 AND old_show_times = 1',
                [
                    value.show_times_id
                ],
                (error, results) => {
                    if (error) {
                        console.log('show_times DELETE old_show_times: an error occured');
                    }
                    console.log('show_times DELETE old_show_times INSERT: ok done');
                }
            )


        });
    }
});