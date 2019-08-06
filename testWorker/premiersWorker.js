const { Worker, isMainThread, workerData } = require('worker_threads');
var exitX = '';


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
  const worker = new Worker('../moviePremiers/mafabMovieNameAndDescriptionCrawlerFree.js', { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  worker.on("exit", function (code) {
    if (code == 0) {
      runService3();
    } else {
      console.log('error: ../moviePremiers/mafabMovieNameAndDescriptionCrawlerFree.js');
      runService2();
    }
  });
  worker.postMessage("twice");
  worker.postMessage("three times");
  worker.postMessage("exit");
  setTimeout(() => worker.postMessage("you won't see me"), 100);
}


function runService3(workerData) {
  const worker = new Worker('../moviePremiers/moviePremiers.js', { workerData });
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
  const worker = new Worker('../moviePremiers/moviePremiersDetailsApiCallFree.js', { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  worker.on("exit", code =>
     code == 0 ? console.log('premiers END') : runService4()
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