'use strict';
let testTMemo = require('./wrapper').getTMemo('test');
let testTMemoNoCache = require('./wrapper').getTMemo('testNoCache', { disableCache: true });

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
            testTMemo.push(req, reqCallback);
        }, Math.floor(Math.random() * 5e3));
    }
}

function simTaskRandomOccurNoCache() {
    for (let i = 0; i < 1e2; i++) {
        setTimeout(() => {
            testTMemoNoCache.push(req, reqCallback);
        }, Math.floor(Math.random() * 5e3))
    }
}

// simTaskRandomOccur();

simTaskRandomOccurNoCache();