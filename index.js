'use strict';

module.exports = class ThrottleMemo {
    constructor(tag, options) {
        this.tag = tag;

        this._tasks = [];
        this._fetching = false;

        this._cache = null;

        this._options = Object.assign({ disableCache: false }, options || {});
    }

    get size() {
        return this._tasks.length;
    }

    _run() {
        this._fetching = true;

        if (this._cache === null) {
            let firstTask = this._tasks[0];
            firstTask[0](...firstTask.slice(1,-1), (err, result) => {
                if (!this._options.disableCache && !err) this._cache = {err, result};
                let curTask;
                while (curTask = this._tasks.shift()) {
                    setImmediate(curTask.slice(-1)[0], err, result);
                }

                this._fetching = false;
            });
        } else {    // if disableCache is true, _cache will always be null, this branch will never run
            let curTask;
            while (curTask = this._tasks.shift()) {
                setImmediate(curTask.slice(-1)[0], this._cache.err, this._cache.result);
            }

            this._fetching = false;
        }
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
