const request = require('request');
var Crawler = require("crawler");

const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});


function kebabToSnake(str) {
    var string = '';
    var chart = '';
    for (i = 0; i < str.length; i++) { //fixed spelling from 'str.lenght'

        string = string + str.charAt(i)
            .replace("'", "");

    }
    return string;
}

pool.query('SELECT imdb_id FROM tv_series', (error, results) => {
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

                    
                        
                       //console.log($(".primary_photo img").text());
                        /*  $( ".imdbRating a" ).each(function( index, a ) {
  console.log('--', a.attribs.href.split('/'));
});*/
            
                                   $( ".cast_list .character a" ).each(function( index, a ) {

     				
                          //console.log(a.children);
                          var episode = '';
                          if (a.attribs.class === 'toggle-episodes') {
                          	//console.log(a);
                           	for (var key in a.children) {
                           		if (typeof a.children[key].data !== 'undefined' && a.children[key].data !== '') {
                           			//console.log(a.children[key].data);
                           			episode = a.children[key].data;
                           			
                           			var d = a.attribs.onclick.split(',');
                           			

                               request('https://v2.sg.media-imdb.com/suggestion/n/' +
                kebabToSnake(d[1]) +
                '.json',
                function(error, response, actorIMDB) {

                    if (typeof JSON.parse(actorIMDB).d !== 'undefined') {

                       // console.log(JSON.parse(actorIMDB).d[0]);
                       
                            //actorFromImdb.push({name: array[actor], id:value.cinema_premier_id});
                            console.log(JSON.parse(actorIMDB).d[0].l);
                            console.log(episode);
                            console.log(kebabToSnake(d[1]));


                        pool.query(
                            'UPDATE actors SET imdb_id = $1, episode = $2 WHERE actor_name = $3 AND movie_imdb_id = $4',
                            [
                                kebabToSnake(d[1]),
                                episode,
                                JSON.parse(actorIMDB).d[0].l,
                                value.imdb_id
                            ],
                            (error, results) => {
                                if (error) {
                                    console.log('an error occured');
                                }
                                console.log('ok done');
                            }
                        )

                    
                    }
                });

                           		}
                           	}
                           }

                          //console.log('-index-', index);
});



                    
                }
                done();
            }
        });

        // Queue just one URL, with default callback
        c.queue('https://www.imdb.com/title/' + value.imdb_id);

    });
});

