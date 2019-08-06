/*const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});


     require('./hello.js');


var id = 'first';

   function doMainStuff() {


     console.log('run');

           pool.query('SELECT value FROM worker WHERE id = $1', [id], (error, results) => {
        //console.log('error',results.rows);

        results.rows.forEach(function(value) {
//when your program starts, do stuff right away.

          if (value.value == 2) {
         require('./world.js');

       }

   });
      });


  

}


  setTimeout(doMainStuff, 10 * 1000);
  */
 
/*

const pg = require('pg');
const pool = new pg.Pool({
    user: 'horvathmiklos',
    host: '127.0.0.1',
    database: 'postgres',
    port: '5432'
});


const { Worker, isMainThread, workerData } = require('worker_threads');


if (isMainThread) {
  const worker = new Worker('./hello.js', { workerData: 'Hello, world!' });
  worker.on('message', (msg) => { console.log(msg); });
  pool.query('SELECT value FROM worker', (error, results) => {
    results.rows.forEach(function(value) {
      if (value.value == 1) {
        console.log(value.value);
  const worker2 = new Worker('./world.js', { workerData: 'Hello, world!' });
        }
    });
});
} else {
  console.log(workerData);  // Prints 'Hello, world!'.
}
*/
/*
const h = [
require('./hello.js'),
require('./world.js')
];

function run() {
  for (let k in h) {
    h[k];
  }

}
*/

var premier = require('./premierWorker.js');


const { Worker, isMainThread, workerData } = require('worker_threads');
var exitX = '';


exports.runNowPlayingMovieWorker = function() {

function runService(workerData) {
  const worker = new Worker(workerData, { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  worker.on("exit", code =>
    runService2()
  );
  worker.postMessage("twice");
  worker.postMessage("three times");
  worker.postMessage("exit");
  setTimeout(() => worker.postMessage("you won't see me"), 100);
}


function runService2(workerData) {
  const worker = new Worker('../nowPlayingMovies/secondCinemaPremierMovieApiCall.js', { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  /*
  worker.on("exit", code =>
    runService3()
  );
  */

  worker.on("exit", function (code) {
    if (code == 0) {
      runService3();
    } else {
      console.log('error error error ../nowPlayingMovies/secondCinemaPremierMovieApiCall.js');
      runService2();
    }
  });
  worker.postMessage("twice");
  worker.postMessage("three times");
  worker.postMessage("exit");
  setTimeout(() => worker.postMessage("you won't see me"), 100);
}


function runService3(workerData) {
  const worker = new Worker('../nowPlayingMovies/thirdOmdbApiCallFree.js', { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  worker.on("exit", code =>
    runService4()
  );
  worker.postMessage("twice");
  worker.postMessage("three times");
  worker.postMessage("exit");
  setTimeout(() => worker.postMessage("you won't see me"), 100);
}

function runService4(workerData) {
  const worker = new Worker('../tvSeries/justWatchTvSeriesApiFree.js', { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  worker.on("exit", code =>
     runService5()
  );
  worker.postMessage("twice");
  worker.postMessage("three times");
  worker.postMessage("exit");
  setTimeout(() => worker.postMessage("you won't see me"), 100);
}

function runService5(workerData) {
  const worker = new Worker('../cast/actorsApiCallFree.js', { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  /*
  worker.on("exit", code =>
    runService6()

  );
  */
  worker.on("exit", function (code) {
    if (code == 0) {
      runService6();
    } else {
      console.log('error error error ../cast/actorsApiCallFree.js');
      setTimeout(function() {
        runService5();
      }, 11000);
    }
  });
  worker.postMessage("twice");
  worker.postMessage("three times");
  worker.postMessage("exit");
  setTimeout(() => worker.postMessage("you won't see me"), 100);
}

function runService6(workerData) {
  const worker = new Worker('../crawlerTest.js', { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  worker.on("exit", code =>
    runService7()
  );
  worker.postMessage("twice");
  worker.postMessage("three times");
  worker.postMessage("exit");
  setTimeout(() => worker.postMessage("you won't see me"), 100);
}

function runService7(workerData) {
  const worker = new Worker('../crawler2test.js', { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  worker.on("exit", code =>
    runService8()
  );
  worker.postMessage("twice");
  worker.postMessage("three times");
  worker.postMessage("exit");
  setTimeout(() => worker.postMessage("you won't see me"), 100);
}

function runService8(workerData) {
  const worker = new Worker('../nowPlayingMovies/cinemaShowTimes.js', { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  worker.on("exit", code =>
    premier.runPremierWorker()
  );
  worker.postMessage("twice");
  worker.postMessage("three times");
  worker.postMessage("exit");
  setTimeout(() => worker.postMessage("you won't see me"), 100);
  
  console.log('ok');
}

async function run() {
  const result = runService("../nowPlayingMovies/firstCinemaPremierMainApiCallFree.js");
  console.log('res1',result);
  console.log('mi ez',{ isMainThread });
}



run().catch(err => console.error(err));

}


/*
function runService2(workerData) {
  const worker = new Worker(workerData, { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  worker.on("exit", code =>
    console.log(`Worker stopped with exit code ${code}`)
  );
  worker.postMessage("twice");
  worker.postMessage("three times");
  worker.postMessage("exit");
  setTimeout(() => worker.postMessage("you won't see me"), 100);
}

async function run2() {
  const result = runService2("./world.js");
  console.log('result',result);
  console.log('mi ez',{ isMainThread });
}


run2().catch(err => console.error(err));
*/
