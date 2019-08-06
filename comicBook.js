const request = require('request');
const moment = require('moment');
const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

pool.query('TRUNCATE cooming_soon_comic_books;', (error, results) => {
    console.log(results);

});

pool.query('ALTER SEQUENCE cooming_soon_comic_books_id_seq RESTART WITH 1;', (error, results) => {
    console.log(results);

});

request(
    'http://www.kilencedik.hu/',
    function(error, response, kilencedik) {
        //console.log('body:', body);
        var comingSoonComicBooks = [];
        var kilencedikCovertToSpace = kilencedik.replace("/\t/g", " ");
        var rrr = [];
        var second = [];
        var name = [];
        var correctMegjelenes = [];
        var correctDate = [];
        var comicBooks = [];
        var xxx = [];
        var url = [];

        comingSoonComicBooks = kilencedikCovertToSpace.match(/<a.*title=".*Megjelen.*[\s].*[\s].*jpg/gmi);
        comingSoonComicBooks.forEach(function(data2) {
            rrr = data2.split('title="');

			var re = /"/gi;
            console.log('----',rrr[0].replace('<a href=','').replace(re, ''));
            url = rrr[0].replace('<a href=','').replace(re, '')
    url = rrr[0].replace('<a href=','').replace(re, '')

            console.log('url ----',url);

            second = rrr[1].split('class="mh-image-placeholder" src="');

            name = second[0].split('/ Megjelenés:');
            correctMegjelenes = name[1].split('">');
            correctDate = correctMegjelenes[0].split(':');
            /*
            console.log('nev', name[0]);
            console.log('megjelenes', correctMegjelenes[0]);
            console.log('second 11111', second[1]);
            console.log('date', correctDate[0]);

            console.log('date ----', moment(correctDate[1]).format("YYYY-MM-DD"));
            */
           
    
            //comicBooks.push({ comicBookName: name[0], release_date: correctMegjelenes[0], img_url: second[1], date: correctDate[1] });



            pool.query('INSERT INTO cooming_soon_comic_books (comic_book__name, img_url, release_date, date, url) VALUES ($1, $2, $3, $4, $5)',
                [name[0], second[1], correctMegjelenes[0], moment(new Date(correctMegjelenes[0])).format("YYYY-MM-DD"), url],
                (error, results) => {
                    //console.log(error, results);
                    if (error) {
                        //console.log('an error occured');
                    }
                    //console.log('ok done');

                });
      
        

        });


    });



