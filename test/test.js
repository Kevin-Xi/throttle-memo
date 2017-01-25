'use strict';
let testTCache = require('./wrapper').getTCache('test');

let totalExe = 0, totalResp = 0;
function asyncTask(callback) {
    setTimeout(() => {
        console.info(`total execute ${totalExe++} time(s)`);
        callback(null, 0);
    }, 500);
}

function req(callback) {
    asyncTask(callback);
}

function reqCallback(err, result) {
    console.log(`\ttotal response ${totalResp++} time(s)`);
}

function simTaskRandomOccur() {
    for (let i = 0; i < 1e2; i++) {
        setTimeout(() => {
            testTCache.push(req, reqCallback);
        }, Math.floor(Math.random() * 5e3));
    }
}

simTaskRandomOccur();
