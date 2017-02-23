'use strict';

const http = require('http');
const url = require('url');
const tMemoWrapper = require('./wrapper');

const PORT = 8033;

// setup cleanup
setInterval(tMemoWrapper.cleanup, 5000);

let server = http.createServer((req, res) => {
    let pathname = url.parse(req.url, true).pathname;
    (handler[pathname.slice(1)] || (() => {}))(req, res);
});

let rc = 0, tc = 0;
let handler = {};
handler.data = (req, res) => {
    let {num} = url.parse(req.url, true).query;
    taskTMemoized(num, (err, result) => {
        if (err) {
            console.error(`err`);
            res.end(0);
        } else {
            console.info(`${rc++}. response ${result}`);
            res.end(result.toString());
        }
    });
}

let taskTMemoized = tMemoWrapper.tMemoize(task);
function task(num, callback) {
    setTimeout(() => {
        console.info(`\t${tc++}. do task`);
        callback(null, num * 10)
    }, Math.floor(Math.random() * 5e2));
}

server.listen(PORT);
console.info(`test server listening on ${PORT}`);
