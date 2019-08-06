//var CronJob = require('cron').CronJob;
//var schedule = require('node-schedule');
const { Worker, isMainThread, workerData } = require('worker_threads');
var cron = require('node-cron');
 
//var nowPlaying = require('./testWorker/nowPlayingMovies.js');
//var premier = require('../testWorker/premierWorker.js');
var nowPlayingMovie = require('../testWorker/nowPlayingMovies.js');
var distributor = require('../testWorker/movieDistributor.js');

cron.schedule('0 11 * * *', () => {
  console.log('running distributor worker');
  distributor.runMovieDistributorWorker();
});

cron.schedule('42 11 * * *', () => {
  console.log('running now playing movies worker');
  nowPlayingMovie.runNowPlayingMovieWorker();

});

/*cron.schedule('12 14 * * *', () => {
  console.log('running premier movies worker');
  premier.runPremierWorker();

});
*/



/*new CronJob('2 * * * * *', function() {
  console.log('You will see this message every minute');
}, null, true, 'Europe/Budapest');
*/

/*
var counter = 1;
setInterval(function(){ console.log(counter++); }, 1000);

*/
