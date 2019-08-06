const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});
const request = require('request');
const RateLimiter = require('request-rate-limiter');
const moment = require('moment');
const Crawler = require("crawler");

var limiter = new RateLimiter({
    rate: 10 // requests per interval,

        ,
    maxWaitingTime: 1500 // return errors for requests
    // that will have to wait for
    // n seconds or more. defaults
    // to 5 minutes
});


function formatter(str) {
    var string = '';
    var chart = '';
    for (i = 0; i < str.length; i++) { //fixed spelling from 'str.lenght'

        string = string + str.charAt(i)
            .replace(/[^0-9]/gmi, '-')
            .toLowerCase();

    }
    return string;
}

for (let i = 1; i <= 2; i++) {
    request(
        'https://www.mafab.hu/cinema/premier/hamarosan-a-mozikban/?page=' + i,
        function(error, response, mafab) {
            //console.log(mafab);

            var mafabSpace = mafab.replace("/\t/g", " ");

            mf = mafabSpace.match(/<span.* class="text".*/gmi);
            mf2 = mafabSpace.match(/<a title=".*" href="\/movies.*/gmi);
            // mf3 = mafabSpace.match(/<p class="desc".*\.\.\./gmi);

            console.log(mf, mf2);

            for (let key in mf) {
                if (moment(formatter(mf[key])).format("YYYY-MM-DD") >= moment().add(8, 'day').format("YYYY-MM-DD")) {

                    pool.query(
                        "INSERT INTO mafab_data (mafab_url) VALUES ($1)",
                        [
                            mf2[key].match(/(href=)\"(.*)\"/)[2]
                        ],
                        (error, results) => {
                            if (error) {
                                console.log('an error occured', error);
                            }
                            console.log('ok done');

                        });

                }
            }

        });
}