//var CronJob = require('cron').CronJob;
//var schedule = require('node-schedule');
const { Worker, isMainThread, workerData } = require('worker_threads');
var cron = require('node-cron');
 
//var nowPlaying = require('./testWorker/nowPlayingMovies.js');
var premier = require('./testWorker/premierWorker.js');

/*cron.schedule('5 0 * * *', () => {
  console.log('running workers');
  nowPlaying.run();
  premiers.run();

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
