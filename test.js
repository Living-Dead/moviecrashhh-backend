
/*
<!DOCTYPE html>
<html>
<body>

<h2>The XMLHttpRequest Object</h2>

<button type="button" onclick="loadDoc()">Request data</button>

<p id="demo"></p>

<script>
function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    
    var parser, xmlDoc;
var text = this.responseText;

parser = new DOMParser();
xmlDoc = parser.parseFromString(text,"text/xml");

document.getElementById("demo").innerHTML =
xmlDoc.getElementsByTagName("lastBuildDate")[0].childNodes[0].nodeValue;
      //document.getElementById("demo").innerHTML = 
    }
  };
  xhttp.open("GET", "https://index.hu/24ora/rss/,", true);
  xhttp.send();
}
</script>

</body>
</html>
*/


const moment = require('moment');

const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});

function getUnique(arr, comp) {

    //store the comparison  values in array
    const unique = arr.map(e => e[comp]).
    // store the keys of the unique objects
    map((e, i, final) => final.indexOf(e) === i && i)
        // eliminate the dead keys & return unique objects
        .filter((e) => arr[e]).map(e => arr[e]);

    return unique

};

//app.post('/show_times', (req, res) => {

    //console.log('--------', req.body.cinema_premier_id);
   var data = [];
   var xxx = [];
   var unique = [];


        pool.query('SELECT * FROM show_times WHERE cinema_premier_id = $1', [1649], (error, results) => {
        //console.log('error',results.rows);


    results.rows.forEach(function(value) {
                   var xxx = [];
   var unique = [];


https://api.themoviedb.org/3/find/tt0137523?api_key=f4e6009df6f9b64f5063de615df82bf9&language=en-US&external_source=imdb_id

        //console.log(value.date);

        if(moment(value.date).format("YYYY-MM-DD") ==  moment().format("YYYY-MM-DD")) {

            //console.log(value.city, value.date);
         
            data.push({city: value.city, cinema_name: value.cinema_name, date: value.date, showtimes: value.showtimes,  cinema_name: value.cinema_name});
            console.log(getUnique(data, 'city'));
         
         }
         });

    amc : https://apis.justwatch.com/content/titles/en_US/popular?body=%7B%22age_certifications%22:null,%22content_types%22:%5B%22show%22%5D,%22genres%22:%5B%22hrr%22,%22crm%22,%22drm%22,%22war%22,%22act%22,%22scf%22%5D,%22languages%22:null,%22max_price%22:null,%22min_price%22:null,%22monetization_types%22:%5B%22flatrate%22,%22ads%22,%22free%22,%22rent%22,%22buy%22%5D,%22page%22:1,%22page_size%22:30,%22presentation_types%22:null,%22providers%22:%5B%22amc%22%5D,%22release_year_from%22:null,%22release_year_until%22:null,%22scoring_filter_types%22:null,%22timeline_type%22:null%7D

 history: https://apis.justwatch.com/content/titles/en_US/popular?body=%7B%22age_certifications%22:null,%22content_types%22:%5B%22show%22%5D,%22genres%22:%5B%22hrr%22,%22drm%22,%22war%22,%22wsn%22,%22scf%22,%22act%22,%22crm%22%5D,%22languages%22:null,%22max_price%22:null,%22min_price%22:null,%22monetization_types%22:%5B%22flatrate%22,%22ads%22,%22free%22,%22rent%22,%22buy%22%5D,%22page%22:1,%22page_size%22:30,%22presentation_types%22:null,%22providers%22:%5B%22his%22%5D,%22release_year_from%22:null,%22release_year_until%22:null,%22scoring_filter_types%22:null,%22timeline_type%22:null%7D   

 hbo go: https://apis.justwatch.com/content/titles/en_US/popular?body=%7B%22age_certifications%22:null,%22content_types%22:%5B%22show%22%5D,%22genres%22:%5B%22hrr%22,%22scf%22,%22war%22,%22trl%22,%22doc%22,%22drm%22%5D,%22languages%22:null,%22max_price%22:null,%22min_price%22:null,%22monetization_types%22:%5B%22flatrate%22,%22ads%22,%22free%22,%22rent%22,%22buy%22%5D,%22page%22:1,%22page_size%22:30,%22presentation_types%22:null,%22providers%22:%5B%22hbg%22%5D,%22release_year_from%22:null,%22release_year_until%22:null,%22scoring_filter_types%22:null,%22timeline_type%22:null%7D   

netflix: https://apis.justwatch.com/content/titles/en_US/popular?body=%7B%22age_certifications%22:null,%22content_types%22:%5B%22show%22%5D,%22genres%22:%5B%22act%22,%22drm%22,%22scf%22,%22hrr%22,%22war%22,%22hst%22%5D,%22languages%22:null,%22max_price%22:null,%22min_price%22:null,%22monetization_types%22:%5B%22flatrate%22,%22ads%22,%22free%22,%22rent%22,%22buy%22%5D,%22page%22:1,%22page_size%22:30,%22presentation_types%22:null,%22providers%22:%5B%22nfx%22%5D,%22release_year_from%22:null,%22release_year_until%22:null,%22scoring_filter_types%22:null,%22timeline_type%22:null%7D


https://apis.justwatch.com/content/titles/en_US/popular?body=%7B%22age_certifications%22:null,%22content_types%22:%5B%22show%22%5D,%22genres%22:%5B%22scf%22,%22war%22,%22hrr%22,%22drm%22,%22crm%22,%22act%22,%22ani%22%5D,%22languages%22:null,%22max_price%22:null,%22min_price%22:null,%22monetization_types%22:%5B%22flatrate%22,%22ads%22,%22free%22,%22rent%22,%22buy%22%5D,%22page%22:1,%22page_size%22:30,%22presentation_types%22:null,%22providers%22:%5B%22hbg%22%5D,%22release_year_from%22:1990,%22release_year_until%22:null,%22scoring_filter_types%22:null,%22timeline_type%22:null%7D

//src="https://images.justwatch.com/poster/8598576/s332/bleach"
//https://images.justwatch.com/poster/21173654/s332/one-punch-man

//console.log(data);
/*        res.json({
            show_times: data,
                message: true,
            
        });

// new idea just watch:
        https://apis.justwatch.com/content/titles/en_US/popular?body=%7B%22page_size%22:1,%22page%22:1,%22query%22:%22dragonball%22,%22content_types%22:[%22show%22]%7D

watch list:
        https://apis.justwatch.com/userwrite/title_list/watchlist/full/locale/en_US?justwatch_id=8rnvjI4oEemIrgpYCjwDdA

        fanartÉ http://webservice.fanart.tv/v3/movies/tt0137523?api_key=3381a67f4f4e90bfeaaac5b6ca7d6a5a]

        http://www.sundance.org/watch/sff19-films

        spotify: https://api.spotify.com/v1/albums/1yyFmCMeNtuLWsLZAXPStf?market=from_token

        
        spotify search: https://api.spotify.com/v1/search?type=album%2Cartist%2Cplaylist%2Ctrack%2Cshow_audio%2Cepisode_audio&q=jurassic%20park*&decorate_restrictions=true&best_match=true&include_external=audio&limit=50&userless=false&market=from_token

        https://gowatchit.com/api/v3/lists/413558?gwi_asset=true&origin_url=http%3A%2F%2Fwww.sundance.org%2Fwatch%2Fsff19-films&modality=list_inline&tracking%5Bresource_type%5D=List&tracking%5Bresource_id%5D=413558&lead_partner_id=16

        https://d37lefl1k5vay2.cloudfront.net/api/1.0/pages/%2Fwinners%2F2019/

https://en.wikipedia.org/wiki/76th_Golden_Globe_Awards

                request(
                                    'http://www.omdbapi.com/?apikey=13b6a95b&i=' + imdbData.id,
                                    function(error, response, omdbApi) {
                                        var genres = [];




                                               cinemaPremierDataOnShow.hu_title,
                                                        imdbData.id,
                                                        genres,
                                                        cinemaPremierDataOnShow.poster_thumb,
                                                        imdbData.l,
                                                        imdbRating,
                                                        JSON.parse(omdbApi).imdbVotes,
                                                        JSON.parse(omdbApi).Actors,
                                                        JSON.parse(omdbApi).Director,
                                                        cinemaPremierDataOnShow.runtime,
                                                        cinemaPremierDataOnShow.distributor,
                                                        cinemaPremierDataOnShow.id,
                                                        cinemaPremierDataOnShow.hu_release,
                                                        cinemaPremierDataOnShow.hu_plot,
                                                        JSON.parse(omdbApi).Writer,
                                                        JSON.parse(omdbApi).Production,
                                                        JSON.parse(omdbApi).Website
        */
      
   // });
//});

                           if (a.attribs.href !== '#') {
                             var imdb_id = a.attribs.href.split('/');
                             

                               request('https://v2.sg.media-imdb.com/suggestion/n/' +
                imdb_id[4].replace(/[\?].*/gi, '') +
                '.json',
                function(error, response, actorIMDB) {

                    if (typeof JSON.parse(actorIMDB).d !== 'undefined') {

                       // console.log(JSON.parse(actorIMDB).d[0]);
                        if (typeof JSON.parse(actorIMDB).d[0].i !== 'undefined') {
                            //actorFromImdb.push({name: array[actor], id:value.cinema_premier_id});
                            console.log(JSON.parse(actorIMDB).d[0].l);
                            console.log(imdb_id);
                             console.log(imdb_id[4].replace(/[\?].*/gi, ''));
                             console.log('---', a.attribs.href);
                             console.log(episode);

                        } else {
                            console.log('error');
                        }
                    }
                });
                          }

https://apis.justwatch.com/content/titles/en_US/popular?body=%7B%22age_certifications%22:null,%22content_types%22:null,%22genres%22:null,%22languages%22:null,%22max_price%22:null,%22min_price%22:null,%22monetization_types%22:%5B%22flatrate%22,%22ads%22,%22free%22,%22rent%22,%22buy%22%5D,%22page%22:1,%22page_size%22:30,%22presentation_types%22:null,%22providers%22:%5B%22hbg%22%5D,%22release_year_from%22:null,%22release_year_until%22:null,%22scoring_filter_types%22:null,%22timeline_type%22:null%7D