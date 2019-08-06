const request = require('request');
const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

const academyAwardWinners = require('../test.json');

/*pool.query('TRUNCATE academy_award_winners;', (error, results) => {
    console.log(results);

});*/

var movieTitle = '';
		var genres = [];

pool.query('SELECT hu_award_title FROM academy_award_winners', (error, results) => {

//pool.query('SELECT category_name, academy_img, nominee_name, academy_year, post_title, hu_award_title FROM academy_award_winners', (error, results) => {
	
results.rows.forEach(function(value) {

//request(
  //  'https://mozipremierek.hu/api/oscar/91/',
    //function(error, response, award) {
	

	if (typeof academyAwardWinners.data.movies[value.hu_award_title][0].movie !== 'undefined') {
		genres = [];
	//console.log('if', JSON.parse(award).data.movies[value.hu_award_title][0].movie.title);
		movieTitle = academyAwardWinners.data.movies[value.hu_award_title][0].movie.title;

            academyAwardWinners.data.movies[value.hu_award_title][0].movie.raw_genres
            .forEach(function(genre) {

                    if (genre.toLowerCase().replace(" ", "-") === 'science-fiction') {
                        genres.push('sci-fi');
                    } else {
                        genres.push(genre.toLowerCase().replace(" ", "-"));
                    }
                    });
	

	} else {

		//console.log('else', JSON.parse(award).data.movies[value.hu_award_title][0].title);
		movieTitle = academyAwardWinners.data.movies[value.hu_award_title][0].title;
		genres = [];
			//var genres = [];
            academyAwardWinners.data.movies[value.hu_award_title][0].genres
            .forEach(function(genre) {

                    if (genre.toLowerCase().replace(" ", "-") === 'science-fiction') {
                        genres.push('sci-fi');
                    } else {
                        genres.push(genre.toLowerCase().replace(" ", "-"));
                    }
                    });
	}

	console.log('title', movieTitle);
	console.log(genres);
});
});

//});

//});
