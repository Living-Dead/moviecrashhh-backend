const request = require('request');
const urlConfig = require('../config/apiUrlConfig.js');
const dbConfig = require('../config/config.js');
const database = require('../database/update/insertFlag.update.js');
const insertCinemaMovies = require('../database/insert/cinemaMovies.insert.js');
const updateCinemaMovies = require('../database/update/cinemaMovies.update.js');

const second = require('./secondCinemaPremierMovieApiCall.js');

const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

database.updateInsertFlag({
    statement: 'UPDATE ',
    tableName: 'now_playing_movies SET ',
    condition: ['insert_flag = NULL'],
});

database.updateInsertFlag({
    statement: 'UPDATE ',
    tableName: 'movie_imdb_id SET ',
    condition: ['flag = NULL'],
});

database.updateInsertFlag({
    statement: 'UPDATE ',
    tableName: 'actors SET ',
    condition: ['flag = NULL'],
});


// Api call
const cinemaPremierId = [];
dbConfig.query(`
        SELECT 
            cinema_premier_id 
        FROM 
            now_playing_movies;`,
    (error, results) => {
        if (typeof results !== 'undefined') {
            if (results.rowCount !== 0) {
                results.rows.forEach(function(value) {
                    cinemaPremierId
                        .push(value.cinema_premier_id);
                });
            }
        }

        request(
            urlConfig.moviePremierMainApi,
            function(error, response, cinema) {

                JSON.parse(cinema).data.on_show
                    .forEach(function(cinemaPremierDataOnShow) {
                        const cinemaMovieGenres = [];
                        cinemaPremierDataOnShow.raw_genres
                            .forEach(function(genre) {
                                if (genre.toLowerCase().replace(" ", "-") === 'science-fiction') {
                                    cinemaMovieGenres
                                        .push('sci-fi');
                                } else {
                                    cinemaMovieGenres
                                        .push(
                                            genre
                                            .toLowerCase()
                                            .replace(" ", "-")
                                        );
                                }
                            });

                        if (cinemaPremierId.indexOf(cinemaPremierDataOnShow.id) === -1) {

                            insertCinemaMovies.nowPlayingMoviesInsertToDb({
                                hu_title: cinemaPremierDataOnShow.hu_title,
                                genres: cinemaMovieGenres,
                                poster_thumb: cinemaPremierDataOnShow.poster_thumb,
                                original_title: cinemaPremierDataOnShow.original_title,
                                runtime: cinemaPremierDataOnShow.runtime,
                                distributor: cinemaPremierDataOnShow.distributor,
                                id: cinemaPremierDataOnShow.id,
                                hu_release: cinemaPremierDataOnShow.hu_release,
                                hu_plot: cinemaPremierDataOnShow.hu_plot,
                            });

                            second.cinema({
                                    cinema_premier_id: cinemaPremierDataOnShow.id,
                                    originalname: cinemaPremierDataOnShow.original_title,
                                    release_date: cinemaPremierDataOnShow.hu_release,
                                    movie_name: cinemaPremierDataOnShow.hu_title,
                                    description: cinemaPremierDataOnShow.hu_plot,
                                },
                                'insert'
                            );

                        } else {

                            updateCinemaMovies.nowPlayingMoviesUpdate({
                                id: cinemaPremierDataOnShow.id,
                            });

                            second.cinema({
                                    cinema_premier_id: cinemaPremierDataOnShow.id,
                                    originalname: cinemaPremierDataOnShow.original_title,
                                    release_date: cinemaPremierDataOnShow.hu_release,
                                    movie_name: cinemaPremierDataOnShow.hu_title,
                                    description: cinemaPremierDataOnShow.hu_plot,
                                },
                                'update'
                            );
                        }
                    });
            });
    });