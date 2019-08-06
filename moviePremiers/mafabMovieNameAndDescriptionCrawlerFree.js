const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});
const Crawler = require("crawler");

pool.query('SELECT * FROM mafab_data', (error, results) => {
    results.rows.forEach(function(value) {
        var c = new Crawler({
            maxConnections: 10,
            // This will be called for each crawled page

            callback: function(error, res, done) {
                if (error) {
                    console.log(error);
                } else {
                    var $ = res.$;



                     $(".mp-title-right").each(function(index, a) {

                            console.log('AAAA', a.children[0].next.children[0].next.children[0].data.replace(/[\n\t]+/g,''));
                 
                           		console.log('AAAA22', a.children[0].next.next.next.children[0].data.replace(/[\n\t]+/g,''));

                           		pool.query(
                                'UPDATE movie_premiers SET movie_name = $1, mafab_url = $3 WHERE original_name = $2',
                                [
                                    a.children[0].next.children[0].next.children[0].data.replace(/[\n\t]+/g,''),
                                    a.children[0].next.next.next.children[0].data.replace(/[\n\t]+/g,''),
                                    value.mafab_url
                                ],
                                (error, results) => {
                                    if (error) {
                                        console.log('movie_premiers movie name mafab crawler UPDATE: an error occured');
                                    }
                                    console.log('movie_premiers movie name mafab crawler UPDATE: ok done');
                                }
                            )

                    });

                   $("meta").each(function(index, a) {
                        if (index === 0) {
                            console.log('index', index);
                            console.log('XXXX', a.attribs.content);

                           // console.log('movie_name', value.movie_name);
                           

                           	pool.query(
                                'UPDATE movie_premiers SET description = $1 WHERE mafab_url = $2 AND description IS NULL',
                                [
                                    a.attribs.content.replace(/.*Tartalom\s./g, ''),
                                    value.mafab_url
                                ],
                                (error, results) => {
                                    if (error) {
                                        console.log('movie_premiers description mafab crawler UPDATE: an error occured');
                                    }
                                    console.log('movie_premiers description mafab crawler UPDATE: ok done');
                                }
                            )
                        }

                    }); 
                }
                done();
            }
        });

        // Queue just one URL, with default callback

        	c.queue('https://www.mafab.hu' + value.mafab_url);


   });

});