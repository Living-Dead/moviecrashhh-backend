const http = require('http');
const fs = require('fs');
const urlConfig = require('../config/apiUrlConfig.js');
const request = require('request');
const XLSX = require('xlsx');
const moment = require('moment');

const yearAndMonthDate = moment().format('YYYY/MM');
const currentDate = moment().add(-1, 'days').format('YYYYMMDD');

http.get(
    'http://filmforgalmazok.hu/wp-content/uploads/2019/08/Megjelenés-20190812.xlsx',
     //urlConfig.movieDistributorExcel + yearAndMonthDate + '/Megjelen%C3%A9s-' + currentDate + '.xlsx',
     (res) => {
    debugger
    const {
        statusCode
    } = res;
    const contentType = res.headers['content-type'];
    console.log(`The type of the file is : ${contentType}`)
    let error;
    if (statusCode !== 200) {
        error = new Error(`Request Failed.\n` +
            `Status Code: ${statusCode}`);
        console.error(error.message);
        process.exit(1);
    }
    if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        return;
    }
    res.setEncoding('binary');
    let rawData = '';
    res.on('data', (chunk) => {
        rawData += chunk;
    });
    res.on('end', () => {
        try {
            const parsedData = xlsxToCSVFunction(rawData);
            // And / Or just put it in a file
            fs.writeFileSync('../distributors/megjelenes.xlsx', rawData, 'binary')
                // console.log(parsedData);
        } catch (e) {
            console.error(e.message);
        }
    });
}).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
});



function xlsxToCSVFunction(rawData) {
    return rawData //you should return the csv file here whatever your tools are
}