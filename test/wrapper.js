'use strict';
const TCache = require('../');

let tcs = {};
exports.getTCache = function (tag) {
    if (tcs[tag]) {
        return tcs[tag];
    }
    let tc = new TCache(tag);
    tcs[tag] = tc;
    return tc;
}

exports.cleanup = function () {
    for (let k in tcs) {
        if (tcs[k].size === 0) delete tcs[k];
    }
    process.stdout.write(`${Object.keys(tcs).length}`);
}
