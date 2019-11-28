const pg = require('pg');
module.exports = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432',
    password: 'postgres'
});