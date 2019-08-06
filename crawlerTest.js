const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

var Crawler = require("crawler");

pool.query('SELECT id FROM movie_imdb_id where flag = 1', (error, results) => {
    results.rows.forEach(function(value) {
        var c = new Crawler({
            maxConnections: 10,
            // This will be called for each crawled page
            callback: function(error, res, done) {
                if (error) {
                    console.log(error);
                } else {
                    var $ = res.$;
                    // $ is Cheerio by default
                    //a lean implementation of core jQuery designed specifically for the server

                    if ($(".ratingValue strong span").text() !== '') {
                        console.log($(".ratingValue strong span").text());

                        //console.log($(".imdbRating").text());
                        /*  $( ".imdbRating a" ).each(function( index, a ) {
  console.log('--', a.attribs.href.split('/'));
});*/
                        console.log($(".imdbRating a .small").text());
                        console.log(value.id);

                        pool.query(
                            'UPDATE movie_imdb_id SET imdb_rate = $1, imdb_vote = $2 WHERE id = $3',
                            [
                                $(".ratingValue strong span").text(),
                                $(".imdbRating a .small").text(),
                                value.id,
                            ],
                            (error, results) => {
                                if (error) {
                                    console.log('an error occured');
                                }
                                console.log('ok done');
                            }
                        )
                    }
                }
                done();
            }
        });

        // Queue just one URL, with default callback
        c.queue('https://www.imdb.com/title/' + value.id);

    });
});