const request = require('request');
var RateLimiter = require('request-rate-limiter');
const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

// second call
//https://apis.justwatch.com/content/titles/hu_HU/popular?body=%7B%22age_certifications%22:[],%22content_types%22:[%22show%22],%22genres%22:[%22act%22,%22crm%22,%22drm%22,%22fnt%22,%22hrr%22,%22scf%22,%22trl%22,%22war%22,%22wsn%22],%22languages%22:null,%22min_price%22:null,%22max_price%22:null,%22monetization_types%22:[%22ads%22,%22buy%22,%22flatrate%22,%22free%22,%22rent%22],%22presentation_types%22:[],%22providers%22:[%22hge%22,%22nfx%22],%22release_year_from%22:2019,%22release_year_until%22:null,%22scoring_filter_types%22:null,%22timeline_type%22:null,%22q%22:null,%22person_id%22:null,%22sort_by%22:null,%22sort_asc%22:null,%22query%22:null,%22page%22:2,%22page_size%22:30%7D

var YouTube = require('youtube-node');

var youTube = new YouTube();
youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');
/*pool.query('TRUNCATE tv_series;',
    (error, results) => {
        console.log(results);

    });
    */

var limiter = new RateLimiter({
    rate: 5 // requests per interval,

        ,
    maxWaitingTime: 1500 // return errors for requests
    // that will have to wait for
    // n seconds or more. defaults
    // to 5 minutes
});

var limiter2 = new RateLimiter({
    rate: 5 // requests per interval,

        ,
    maxWaitingTime: 1500 // return errors for requests
    // that will have to wait for
    // n seconds or more. defaults
    // to 5 minutes
});

var languagesConf = [
    'en',
    'fr',
    'hi',
    'es',
    'nl',
    'hu',
    'ru',
];

function kebabToSnake(str) {
    var string = '';
    var chart = '';
    for (i = 0; i < str.length; i++) { //fixed spelling from 'str.lenght'

        string = string + str.charAt(i)
            .replace(" ", "_")
            .replace("á", "a")
            .replace("é", "e")
            .replace("í", "i")
            .replace("ó", "o")
            .replace("ö", "o")
            .replace("ő", "o")
            .replace("ú", "u")
            .replace("ű", "u")
            .replace("ü", "u")
            .replace(/[^_!a-zA-Z]/g, "")
            .toLowerCase();

    }
    return string;
}

function characterReplace(str) {
    var string = '';
    var chart = '';
    for (i = 0; i < str.length; i++) { //fixed spelling from 'str.lenght'

        string = string + str.charAt(i)
            .replace(" ", "_")
            .replace(":", "_")
            .toLowerCase();

    }
    return string;
}

function youtubeFormatter(str) {
    var string = '';
    var chart = '';
    for (i = 0; i < str.length; i++) { //fixed spelling from 'str.lenght'

        string = string + str.charAt(i)
            .replace(" ", "_");

    }
    return string;
}

function createUniqueActorId(object) {
    return characterReplace(object.name) + '_' + characterReplace(object.originalMovieName);
}


request(
    'https://apis.justwatch.com/content/titles/hu_HU/popular?body=%7B%22age_certifications%22:[],%22content_types%22:[%22show%22],%22genres%22:[%22act%22,%22crm%22,%22drm%22,%22fnt%22,%22hrr%22,%22scf%22,%22trl%22,%22war%22,%22wsn%22],%22languages%22:null,%22min_price%22:null,%22max_price%22:null,%22monetization_types%22:[%22ads%22,%22buy%22,%22flatrate%22,%22free%22,%22rent%22],%22presentation_types%22:[],%22providers%22:[%22hge%22,%22nfx%22],%22release_year_from%22:2019,%22release_year_until%22:null,%22scoring_filter_types%22:null,%22timeline_type%22:null,%22q%22:null,%22person_id%22:null,%22sort_by%22:null,%22sort_asc%22:null,%22query%22:null,%22page%22:1,%22page_size%22:30%7D',
    function(error, response, justWatch) {

        console.log(justWatch);

        JSON.parse(justWatch).items.forEach(function(justWatchApi) {
            //let title = kebabToSnake(justWatchApi.title);

            request(
                'https://apis.justwatch.com/content/titles/show/' + justWatchApi.id + '/locale/hu_HU',
                function(error, response, justWatchShowContent) {

                    //console.log('justWatchShowContent', justWatchShowContent);

                    JSON.parse(justWatchShowContent).external_ids
                        .forEach(function(externalIds) {

                            if (externalIds.provider === 'imdb') {
                                console.log(externalIds.provider);
                                console.log(externalIds.external_id);

                                request(
                                    'https://v2.sg.media-imdb.com/suggestion/t/' + externalIds.external_id + '.json',
                                    function(error, response, imdb) {


                                        if (typeof JSON.parse(imdb).d !== 'undefined') {


                                            JSON.parse(imdb).d.forEach(function(imdbData) {

                                                console.log('console.log(imdbData.l)', imdbData.l);

                                                youTube.search(youtubeFormatter(imdbData.l) + ' ' + 'Official Trailer', 2, function(error, result) {
                                                    if (error) {
                                                        console.log(error);
                                                    } else {
                                                        var trailerIds = [];
                                                        for (let i = 0; i < result.items.length; i++) {
                                                            console.log(JSON.stringify(result.items[i].id.videoId, null, 2));
                                                            console.log(JSON.stringify(result.items[i].snippet.title, null, 2));
                                                            trailerIds.push(result.items[i].id.videoId);
                                                        }
                                                        console.log(trailerIds);
                                                    }



                                                   /* pool.query(
                                                        'INSERT INTO movie_trailer (imdb_id, movie_original_name, trailer_ids) VALUES ($1, $2, $3)',
                                                        [
                                                            externalIds.external_id,
                                                            imdbData.l,
                                                            trailerIds
                                                        ],
                                                        (error, results) => {
                                                            if (error) {
                                                                console.log('now_playing_movies INSERT: an error occured', error);
                                                            }
                                                            console.log('now_playing_movies INSERT: ok done');

                                                        });
                                                        */
                                                });
                                            });
                                        }

                                    });
                            }
                            if (externalIds.provider === 'tmdb') {
                                console.log(externalIds.provider);
                                console.log(externalIds.external_id);

                                request(
                                    'https://api.themoviedb.org/3/tv/' + externalIds.external_id + '/credits?api_key=64180bb269e67eeb00bd064cc9ea90d1&language=en-US',
                                    function(error, response, theMovieDbTvCredit) {
                                        for (var key in JSON.parse(theMovieDbTvCredit).cast) {
                                            console.log('character', JSON.parse(theMovieDbTvCredit).cast[key].character);
                                            console.log('name', JSON.parse(theMovieDbTvCredit).cast[key].name);
                                            console.log('profile_path', JSON.parse(theMovieDbTvCredit).cast[key].profile_path);


                                            /* pool.query(
                                                 'INSERT INTO actors (actor_name, character, movie_name, movie_imdb_id, actor_avatar_img, actor_unique_id) VALUES ($1, $2, $3, $4, $5, $6)',
                                                 [
                                                     JSON.parse(theMovieDbTvCredit).cast[key].name,
                                                     JSON.parse(theMovieDbTvCredit).cast[key].character,
                                                     imdbData.l,
                                                     imdbData.id,
                                                     JSON.parse(theMovieDbTvCredit).cast[key].profile_path,
                                                     createUniqueActorId({
                                                         name: JSON.parse(theMovieDbTvCredit).cast[key].name,
                                                         originalMovieName: imdbData.l,
                                                     })
                                                 ],
                                                 (error, results) => {
                                                     if (error) {
                                                         console.log('an error occured', error);
                                                     }
                                                     console.log('ok done');


                                                 });
                                                 */
                                        }
                                    });

                                limiter.request({
                                    url: 'https://api.themoviedb.org/3/tv/' + externalIds.external_id + '?api_key=f4e6009df6f9b64f5063de615df82bf9&language=en-US',
                                }).then(function(theMovieDbTvSeries) {
                                    console.log(JSON.parse(theMovieDbTvSeries.body).networks);
                                    console.log(JSON.parse(theMovieDbTvSeries.body).production_companies);
                                    console.log(JSON.parse(theMovieDbTvSeries.body).backdrop_path);
                                    console.log(JSON.parse(theMovieDbTvSeries.body).homepage);
                                    console.log(JSON.parse(theMovieDbTvSeries.body).still_path);
                                    console.log(JSON.parse(theMovieDbTvSeries.body).name);

                                    var genreX = [];

                                    for (var genreKey in JSON.parse(theMovieDbTvSeries.body).genres) {
                                        genreX.push(
                                            JSON.parse(theMovieDbTvSeries.body).genres[genreKey].id
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
                                    console.log(genreX);
                                });

                            }

                        });

                    if (typeof JSON.parse(justWatchShowContent).credits !== 'undefined') {

                        JSON.parse(justWatchShowContent).credits.forEach(function(credit) {
                            if (credit.role === 'DIRECTOR') {
                                console.log('director', credit.name);
                            }
                            if (credit.role === 'WRITER') {
                                console.log('writer', credit.name);
                            }
                            if (credit.role === 'MUSIC') {
                                console.log('music', credit.name);
                            }
                        });
                    }

                    console.log(JSON.parse(justWatchShowContent).max_season_number);
                    console.log(JSON.parse(justWatchShowContent).original_release_year);
                    console.log(JSON.parse(justWatchShowContent).original_title);
                    console.log(JSON.parse(justWatchShowContent).title);
                    if (typeof JSON.parse(justWatchShowContent).poster !== 'undefined') {
                        console.log(JSON.parse(justWatchShowContent).poster.replace('{profile}', ''));
                    }
                    console.log(justWatchApi.id);
                    console.log(JSON.parse(justWatchShowContent).seasons);
                    console.log(JSON.parse(justWatchShowContent).short_description);



                });
        });


    });