const { Worker, isMainThread, workerData } = require('worker_threads');
var exitX = '';


exports.runPremierWorker = function() {

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
  const worker = new Worker('../moviePremiers/moviePremiers.js', { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  worker.on("exit", code =>
    runService3()
  );
  worker.postMessage("twice");
  worker.postMessage("three times");
  worker.postMessage("exit");
  setTimeout(() => worker.postMessage("you won't see me"), 100);
}


function runService3(workerData) {
  const worker = new Worker('../moviePremiers/mafabMovieNameAndDescriptionCrawlerFree.js', { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  worker.on("exit", function (code) {
    if (code == 0) {
      runService4();
    } else {
      console.log('error: ../moviePremiers/mafabMovieNameAndDescriptionCrawlerFree.js');
      runService3();
    }
  });
  worker.postMessage("twice");
  worker.postMessage("three times");
  worker.postMessage("exit");
  setTimeout(() => worker.postMessage("you won't see me"), 100);
}

function runService4(workerData) {
  const worker = new Worker('../moviePremiers/moviePremiersDetailsApiCallFree.js', { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  worker.on("exit", code =>
     code == 0 ? runService5() : runService4()
  );
  worker.postMessage("twice");
  worker.postMessage("three times");
  worker.postMessage("exit");
  setTimeout(() => worker.postMessage("you won't see me"), 100);
}

function runService5(workerData) {
  const worker = new Worker('../crawlerTest.js', { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  worker.on("exit", code =>
    runService6()
  );
  worker.postMessage("twice");
  worker.postMessage("three times");
  worker.postMessage("exit");
  setTimeout(() => worker.postMessage("you won't see me"), 100);
}

function runService6(workerData) {
  const worker = new Worker('../reindex/indexer.js', { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  worker.on("exit", code =>
     code == 0 ? runService7() : runService6()
  );
  worker.postMessage("twice");
  worker.postMessage("three times");
  worker.postMessage("exit");
  setTimeout(() => worker.postMessage("you won't see me"), 100);
}

function runService7(workerData) {
  const worker = new Worker('../reindex/premiersIndexer.js', { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  worker.on("exit", code =>
     code == 0 ? console.log('Movie Premiers End') : runService7()
  );
  worker.postMessage("twice");
  worker.postMessage("three times");
  worker.postMessage("exit");
  setTimeout(() => worker.postMessage("you won't see me"), 100);
}

async function run() {
  const result = runService("../moviePremiers/mafabUrlCrawlerFree.js");
  console.log('res1',result);
  console.log('mi ez',{ isMainThread });
}




run().catch(err => console.error(err));
}