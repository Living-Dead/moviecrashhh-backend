const { Worker, isMainThread, workerData } = require('worker_threads');
var exitX = '';


exports.runMovieDistributorWorker = function() {

function runService(workerData) {
  const worker = new Worker(workerData, { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  worker.on("exit", function (code) {
    console.log(code);
    if (code == 0) {
      runService2();
    } else {
      console.log('error:', workerData);
      process.exit(1);
    }
  });
}


function runService2(workerData) {
  const worker = new Worker('../distributors/excelToJsonFormatter.js', { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  worker.on("exit", function (code) {
    if (code == 0) {
      runService3();
    } else {
      console.log('error:', workerData);
    }
  });
}


function runService3(workerData) {
  const worker = new Worker('../distributors/excelJsonFormatValueInsertDb.js', { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  worker.on("exit", function (code) {
    if (code == 0) {
      runService4();
    } else {
      console.log('error:', workerData);
    }
  });
}


function runService4(workerData) {
  const worker = new Worker('../distributors/excelFileRemove.js', { workerData });
  worker.postMessage("once");
  worker.on("message", incoming => console.log('wtf',{ incoming }));
  worker.on("error", code => new Error(`Worker error with exit code ${code}`));
  worker.on("exit", code =>
     code == 0 ? console.log('END') : console.log('error', code)
  );
}


async function run() {
  const result = runService("../distributors/excelDownload.js");
  console.log('res1',result);
  console.log('mi ez',{ isMainThread });
}




run().catch(err => console.error(err));
}