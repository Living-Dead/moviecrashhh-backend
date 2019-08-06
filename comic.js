var HTMLParser = require('node-html-parser');
const request = require('request');

request(
    'https://hu.wikipedia.org/wiki/P%C3%B3kember',
    function(error, response, justWatch) {

const root = HTMLParser.parse(justWatch);
console.log(root.querySelector('#mw-content-text p'));
// { tagName: 'ul',
//   rawAttrs: 'id="list"',
//   childNodes:
//    [ { tagName: 'li',
//        rawAttrs: '',
//        childNodes: [Object],
//        classNames: [] } ],
//   id: 'list',
//   classNames: [] }

console.log(root.querySelector('#mw-content-text').toString());

});