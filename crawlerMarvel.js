/*var Crawler = require("crawler");


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

                    //console.log($("").text());

                              
                    //        console.log('INDEX', index + ": " + $( this ).text() );
  //console.log('-1-', a.attribs.src);

                                              $( ".listItem img" ).each(function( index, a ) {

 console.log('-1-', a.attribs.src);
});


                        $( ".listItem .listItem__data a" ).each(function( index, a ) {
     
                          console.log($( this ).text());
});



                    }
                
                done();
            }
        });

        // Queue just one URL, with default callback
        c.queue('https://www.ranker.com/crowdranked-list/top-marvel-comics-superheroes');
        */
/*
        var Marvel = require('marvel')
 
var marvel = new Marvel({ publicKey: "84c77d66208ee31fb89d4a8a5d1b9ffa", privateKey: "8de464bd83a9a3f2bf32b8e2027a73ef703c4938"})
 
marvel.characters
  .name("Hulk")
  .get(function(err, resp) {
    if (err) { console.log("Error: ", err) }
    else { console.log('RESPONSE',resp) }
  })
*/

  var Crawler = require("crawler");


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


                     //console.log($(".JCAZList-list"));
                        
                        //console.log($(".qe1Dgc .wfg6Pb").text());
                        $( ".JCAZList-list a" ).each(function( index, a ) {
                            console.log('INDEX', index + ": " + $( this ).text() );
// console.log('--', a.attribs.href);
});
                        //console.log($(".imdbRating a .small").text());


                    }
                
                done();
            }
        });

        // Queue just one URL, with default callback
        c.queue('https://www.marvel.com/comics/characters');

        
