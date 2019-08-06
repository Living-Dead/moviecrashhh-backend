const request = require('request');
const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

pool.query('TRUNCATE academy_award_winners;', (error, results) => {
    console.log(results);

});


function translate(str) {

    var string = '';


    switch (str) {
        case 'Writing (Original Screenplay)':
            {
                string = 'Legjobb eredeti forgatókönyv';
                break;
            }
        case 'Writing (Adapted Screenplay)':
            {
                string = 'Legjobb adaptált forgatókönyv';
                break;
            }
        case 'Visual Effects':
            {
                string = 'Legjobb vizuális effektek';
                break;
            }
        case 'Sound Mixing':
            {
                string = 'Legjobb hangkeverés';
                break;
            }
        case 'Sound Editing':
            {
                string = 'Legjobb hangvágás';
                break;
            }
        case 'Short Film (Live Action)':
            {
                string = 'Legjobb rövidfilm';
                break;
            }
        case 'Short Film (Animated)':
            {
                string = 'Legjobb rövid animációs film';
                break;
            }
        case 'Production Design':
            {
                string = 'Legjobb látvány';
                break;
            }
        case 'Music (Original Song)':
            {
                string = 'Legjobb betétdal';
                break;
            }
        case 'Foreign Language Film':
            {
                string = 'Legjobb idegen nyelvű film';
                break;
            }
        case 'Music (Original Score)':
            {
                string = 'Legjobb zene';
                break;
            }
        case 'Makeup and Hairstyling':
            {
                string = 'Legjobb smink';
                break;
            }
        case 'Film Editing':
            {
                string = 'Legjobb vágás';
                break;
            }
        case 'Directing':
            {
                string = 'Legjobb rendező';
                break;
            }
        case 'Actor in a Leading Role':
            {
                string = 'Legjobb férfi főszereplő';
                break;
            }
        case 'Costume Design':
            {
                string = 'Legjobb jelmez';
                break;
            }
        case 'Documentary (Short Subject)':
            {
                string = 'Legjobb rövid dokumentumfilm';
                break;
            }
        case 'Cinematography':
            {
                string = 'Legjobb fényképezés';
                break;
            }
        case 'Animated Feature Film':
            {
                string = 'Legjobb animációs film';
                break;
            }
        case 'Actress in a Supporting Role':
            {
                string = 'Legjobb női mellékszereplő';
                break;
            }
        case 'Actress in a Leading Role':
            {
                string = 'Legjobb női főszereplő';
                break;
            }
        case 'Actor in a Supporting Role':
            {
                string = 'Legjobb férfi mellékszereplő';
                break;
            }
        case 'Best Picture':
            {
                string = 'Legjobb film';
                break;
            }
        case 'Documentary (Feature)':
            {
                string = 'Legjobb dokumentumfilm';
                break;
            }
        default:
            {
                string = '';
                break;
            }
    }
    return string
}


request(
    'https://d37lefl1k5vay2.cloudfront.net/api/1.0/pages/%2Fwinners%2F2019/',
    function(error, response, academyAward) {

        //console.log(academyAward);
        //console.log(JSON.parse(academyAward).data.sections.winners);

        for (var category in JSON.parse(academyAward).data.sections.winners) {

            // console.log(JSON.parse(academyAward).data.sections.winners[category]);

            // console.log('category_name', JSON.parse(academyAward).data.sections.winners[category].category_name);


            //console.log(JSON.parse(academyAward).data.sections.winners[category].result);

            for (var winners in JSON.parse(academyAward).data.sections.winners[category].result) {
                if (JSON.parse(academyAward).data.sections.winners[category].result[winners].winner) {
                    console.log(JSON.parse(academyAward).data.sections.winners[category].category_name);
                    console.log(JSON.parse(academyAward).data.sections.winners[category].result[winners].post_title);
                    console.log(JSON.parse(academyAward).data.sections.winners[category].result[winners].nominee_description);
                    console.log(JSON.parse(academyAward).data.sections.winners[category].result[winners].nomination_year);
                    console.log(JSON.parse(academyAward).data.sections.winners[category].result[winners].winner_img.url);

                    pool.query(
                        'INSERT INTO academy_award_winners ( category_name, academy_img, nominee_name, academy_year, post_title, hu_award_title ) VALUES ($1, $2, $3, $4, $5, $6)',
                        [
                            JSON.parse(academyAward).data.sections.winners[category].category_name,
                            JSON.parse(academyAward).data.sections.winners[category].result[winners].winner_img.url,
                            JSON.parse(academyAward).data.sections.winners[category].result[winners].nominee_description,
                            JSON.parse(academyAward).data.sections.winners[category].result[winners].nomination_year,
                            JSON.parse(academyAward).data.sections.winners[category].result[winners].post_title,
                            translate(JSON.parse(academyAward).data.sections.winners[category].category_name)
                        ],
                        (error, results) => {
                            if (error) {
                                console.log('an error occured', error);
                            }
                            console.log('ok done');

                        });

                }
            }

        }
        /* pool.query(


             'UPDATE now_playing_movies SET imdb_id = $1 WHERE cinema_premier_id = $2',
             [
                 JSON.parse(cinemaPremierDataOnShow).imdb_id,
                 value.cinema_premier_id
             ],
             (error, results) => {
                 if (error) {
                     console.log('an error occured');
                 }
                 console.log('ok done');
             }
         )
         */

    });