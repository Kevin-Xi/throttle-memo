'use strict';
const TMemo = require('../');

let tms = {};
function getTMemo(tag) {
    if (tms[tag]) {
        return tms[tag];
    }
    let tm = new TMemo(tag);
    tms[tag] = tm;
    return tm;
}
exports.getTMemo = getTMemo;

exports.cleanup = function () {
    for (let k in tms) {
        if (tms[k].size === 0) delete tms[k];
    }
    process.stdout.write(`${Object.keys(tms).length}`);
}

exports.tMemoizeImmutable = function (func) {
    return function (...args) {
        let tag = `${func.name}-` + args.slice(0, -1).join('~');
        getTMemo(tag).push(func, ...args);
    }
}

exports.tMemoize = function (func) {
    return function (...args) {
        let id = genId(func);
        let tag = `${id}-` + args.slice(0, -1).join('~');
        getTMemo(tag).push(func, ...args);
    }
}

let acc = 0;
function genId(func) {
    if (func.__tmemoid === undefined) {
        func.__tmemoid = ++acc;
    }

    return func.__tmemoid;
}