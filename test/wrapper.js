'use strict';
const TMemo = require('../');

let tms = {};
exports.getTMemo = function (tag) {
    if (tms[tag]) {
        return tms[tag];
    }
    let tm = new TMemo(tag);
    tms[tag] = tm;
    return tm;
}

exports.cleanup = function () {
    for (let k in tms) {
        if (tms[k].size === 0) delete tms[k];
    }
    process.stdout.write(`${Object.keys(tms).length}`);
}
