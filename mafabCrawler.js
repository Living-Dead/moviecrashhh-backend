/*const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});


var Crawler = require("crawler");
const moment = require('moment');

function kebabToSnake(str) {
    var string = '';
    var chart = '';
    for (i = 0; i < str.length; i++) { //fixed spelling from 'str.lenght'

        string = string
            .replace("\n", " ")
            .replace(". ", ".")
            .replace("\t", " ") + str.charAt(i);

    }
    return string;
}


//pool.query('SELECT id FROM movie_imdb_id', (error, results) => {
 //   results.rows.forEach(function(value) {
        var c = new Crawler({
            maxConnections: 10,
            // This will be called for each crawled page
            callback: function(error, res, done) {
                if (error) {
                    console.log(error);
                } else {
                    var $ = res.$;
                    var array = [];
                     var array2 = [];

                    console.log($(".num").text());
                    //array.push(kebabToSnake($(".num").text()));

                     //console.log(moment(dateX).format("YYYY-MM-DD"));


                    

                          console.log($(".row .movie_title_link").text());
                          //array2.push($(".row .movie_title_link").text());

                         // console.log(array);


                         // console.log(array2);

                          /*for (let key in array) {
                              console.log(array[key]);
                          }*/

/*$( ".row a" ).each(function( index, a ) {
     console.log('index', index);
     console.log('a', a);
 });*/
// $ is Cheerio by default
//a lean implementation of core jQuery designed specifically for the server

//if ($(".ratingValue strong span").text() !== '') {
//console.log($(".row .num").text());
//console.log($(".row .movie_list_item a .movie_title").text());

//console.log($(".imdbRating").text());
/*  $( ".imdbRating a" ).each(function( index, a ) {
  console.log('--', a.attribs.href.split('/'));
});*/
//console.log($(".imdbRating a .small").text());
// console.log(value.id);

/*              pool.query(
                            'INSERT INTO movie_premiers (movie_name) VALUE ($1)',
                            [
                             $(".row .movie_title_link").text()
                            ],
                            (error, results) => {
                                if (error) {
                                    console.log('an error occured');
                                }
                                console.log('ok done');
                            }
                        )
                   // }
                }
                done();
            }
        });

        // Queue just one URL, with default callback
        c.queue('https://www.mafab.hu/cinema/premier/hamarosan-a-mozikban/?page=1');

//    });
//});

*/

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

function kebabToSnake(str) {
    var string = '';
    var chart = '';
    for (i = 0; i < str.length; i++) { //fixed spelling from 'str.lenght'

        string = string + str.charAt(i)
            .replace(" ", "-")
            .replace("á", "a")
            .replace("é", "e")
            .replace("í", "i")
            .replace("ó", "o")
            .replace("ö", "o")
            .replace("ő", "o")
            .replace("ú", "u")
            .replace("ű", "u")
            .replace("ü", "u")
            .replace(/[^-!a-zA-Z0-9]/g, "")
            .toLowerCase();

    }
    return string;
}

function formatter(str) {
    var string = '';
    var chart = '';
    for (i = 0; i < str.length; i++) { //fixed spelling from 'str.lenght'

        string = string +
            str.charAt(i).replace(/[^\d]/gi, "");

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
                //console.log(moment(formatter(mf[key])).format("YYYY-MM-DD"));
                //console.log(mf2[key].replace(/<a title=".*" href="\/movies.*?>/gi, '').replace('</a>', ''));
                console.log('---', mf2[key].match(/(href=)\"(.*)\"/)[2]);

                var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page

    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            //console.log(' ' + $(".biobox_short_0 p").text() + ' ');

            $( ".biobox_short_0 p" ).each(function( index, a ) {
                console.log('index');
                console.log('XXXX', a);

            });
        }
        done();
    }
});
 
// Queue just one URL, with default callback
c.queue('https://www.mafab.hu' + mf2[key].match(/(href=)\"(.*)\"/)[2]);
                //var provider = mf2[key].replace(/<a title=".*" href="\/movies.*?>/gi, '').replace('</a>', '');


               /* limiter.request({
                    url: 'https://v2.sg.media-imdb.com/suggestion/' +
                        kebabToSnake(provider)
                        .charAt(0)
                        .toLowerCase() +
                        '/' +
                        kebabToSnake(provider) +
                        '.json',
                }).then(function(imdb) {

                    if (typeof JSON.parse(imdb.body).d !== 'undefined') {

                        if (JSON.parse(imdb.body).d[0].q === 'feature' && typeof JSON.parse(imdb.body).d[0].id !== 'undefined' && JSON.parse(imdb.body).d[0].id !== '') {
                            
                           // console.log('title', JSON.parse(imdb.body).d[0].l);
                            //console.log('year', JSON.parse(imdb.body).d[0].y);
                            //console.log('id', JSON.parse(imdb.body).d[0].id);
                            console.log('key', key);
                            console.log('hu name', mf2[key].replace(/<a title=".*" href="\/movies.*?>/gi, '').replace('</a>', ''));
                          //  console.log('description', mf3[key].replace('<p class="desc">', ''));
                            
                            
                            request(
                                'https://api.themoviedb.org/3/find/' + JSON.parse(imdb.body).d[0].id + '?api_key=f4e6009df6f9b64f5063de615df82bf9&language=en-US&external_source=imdb_id',
                                function(error, response, theMovieDb) {
                                    if (JSON.parse(theMovieDb).movie_results[0].genre_ids.indexOf(35) === -1) {
                                        var genreX = [];

                                        for (var genreKey in JSON.parse(theMovieDb).movie_results[0].genre_ids) {
                                            genreX.push(
                                                JSON.parse(theMovieDb).movie_results[0].genre_ids[genreKey]
                                                .toString()
                                                .replace('27', 'horror')
                                                .replace('878', 'sci-fi')
                                                .replace('53', 'thriller')
                                                .replace('18', 'drama')
                                                .replace('80', 'crime')
                                                .replace('10752', 'war')
                                                .replace('10765', 'sci-fi')
                                                .replace('10759', 'action')
                                                .replace('35', 'comedy')
                                                .replace('9648', 'mistery')
                                                .replace('37', 'western')
                                                .replace('10749', 'romance')
                                                .replace('28', 'action')
                                                .replace('12', 'adventure')
                                                .replace('16', 'animation')
                                                .replace('10751', 'family')
                                                .replace('10402', 'music')
                                                .replace('36', 'history')
                                            );
                                        }

                                        console.log('title', JSON.parse(imdb.body).d[0].l);
                                        console.log('year', JSON.parse(imdb.body).d[0].y);
                                        console.log('id', JSON.parse(imdb.body).d[0].id);
                                        console.log('hu name', mf2[key].replace(/<a title=".*" href="\/movies.*?>/gi, '').replace('</a>', ''));
                                        //console.log('description', mf3[key].replace('<p class="desc">', ''));
                                        console.log(JSON.parse(theMovieDb).movie_results[0].backdrop_path);
                                        console.log('genre', genreX);
                                        console.log(JSON.parse(theMovieDb).movie_results[0].title);
                                        console.log(JSON.parse(theMovieDb).movie_results[0].id);
                                        //console.log(JSON.parse(theMovieDb).movie_results[0].homepage);

                                        request(
                                            'https://api.themoviedb.org/3/movie/' + JSON.parse(theMovieDb).movie_results[0].id + '/credits?api_key=f4e6009df6f9b64f5063de615df82bf9&language=en-US',
                                            function(error, response, theMovieDbTvCredit) {
                                                for (var key in JSON.parse(theMovieDbTvCredit).cast) {
                                                    console.log('character', JSON.parse(theMovieDbTvCredit).cast[key].character);
                                                    console.log('name', JSON.parse(theMovieDbTvCredit).cast[key].name);
                                                    console.log('profile_path', JSON.parse(theMovieDbTvCredit).cast[key].profile_path);
                                                }
                                            })
                                    }
                                });
                            
                        }
                    }
                }); */

            }
        }

    });
}