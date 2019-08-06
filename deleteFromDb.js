const moment = require('moment');
const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

pool.query('SELECT date FROM show_times WHERE date <= $1', [moment().add(-1, 'days').format('YYYY-MM-DD')], (error, results) => {
    results.rows.forEach(function(value) {
        console.log(value.date);;
    });
});