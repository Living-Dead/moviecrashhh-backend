 //xlsxj = require("xlsx-to-json");

/*
  xlsxj({
    input: "megjelenes.xlsx", 
    output: "output.json"
  }, function(err, result) {
    if(err) {
      console.error(err);
    }else {
      console.log(result);
    }
  });
  */


  node_xj = require("xls-to-json");
  node_xj({
    input: "../distributors/megjelenes.xlsx",  // input xls
    output: "../distributors/output.json",
    //rowsToSkip: 1 // output json

  }, function(err, result) {
    if(err) {
      console.error(err);
    } else {
      console.log(result);
    }
  });
  
  