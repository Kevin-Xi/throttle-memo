'use strict';

let tcs = {};
exports.getTCache = function (tag) {
    if (tcs[tag]) {
        return tcs[tag];
    }
    let tc = new TCache(tag);
    tcs[tag] = tc;
    return tc;
}

class TCache {
    constructor(tag) {
        this.tag = tag;

        this._tasks = [];
        this._fetching = false;
    }

    _run() {
        this._fetching = true;

        let firstTask = this._tasks[0];
        firstTask[0](...firstTask.slice(1,-1), (err, result) => {
            let curTask;
            while (curTask = this._tasks.shift()) {
                setImmediate(curTask.slice(-1)[0], err, result);
            }

            this._fetching = false;
        });
    }

    push(func, ...args) {
        if (typeof func !== 'function' ||
            typeof args.slice(-1)[0] !== 'function') {
            return false;
        }

        this._tasks.push([func, ...args]);
        if (!this._fetching) this._run();
        return true;
    }
}
