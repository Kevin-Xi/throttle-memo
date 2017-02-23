# throttle-memo

A memoization works with async tasks that can be throttled.

## Example

For more, see [test/](test).

```js
// consider a case of web server
// in client(many of them run concurrently):
request(server, args, (err, result) {
    // get response
});

// in server:
const tMemoWrapper = require('.test/wrapper');

function asyncTask(args, callback) {
    // some async task
}
// the signature of asyncTaskTMemoized is identical with asyncTask
let asyncTaskTMemoized = tMemoWrapper.tMemoize(asyncTask);

listen((request, response) => {
    asyncTaskTMemoized(request.args, (err, result) => {
        // only the first asyncTask will actually execute with a batch of requests
        // if no err, the result of asyncTask will be cached for any later requests
        // with same `args`
        response.send(err, result);
    });
});
```

## Description

It will **only** call the first one of a batch of async tasks that come in together, and when it has result, share it to all other tasks. If no error occurred, it will cache the result for any later tasks by default. So it is a kind of throttle from the aspect of the dependencies of those async tasks, and a memoization from the aspect of those tasks.

A possible scene is that requests come in concurrently, and when the first of those requests execute, some setup should be done and should only be done once, after that, the result can be share between all requests. (You might consider to use some kind of lock or queue to handle the concurrency, and cache the result to optimize performance in this case. [FYI an implementation from reddit](https://github.com/reddit/reddit/blob/master/r2/r2/lib/memoize.py).)
For example, lots of people ask a room for meeting from time to time, and when the first person comes, a meeting room should be prepared, then the room number should be given to this person and all others will attend the same meeting.

Also notice that this package is not particular designed for distributed system.

Actually, I am not sure what this programming idiom composition really is or if it already has an mature implemention. Feedback is welcome.

## Installation

```bash
$ npm install throttle-memo
```

## API

### push(func, ...args)

Push a function and its arguments, expect for callback when a result in the same throttle-memo is came back.

The `func` is expect to be a async task, and the last of `args` should be its callback, with signature callback(err, result).

Return `true` if push success, else return `false`.

### size

A getter of the length of tasks in throttle-memo.

## Tests

```bash
$ npm test/test # local test
# or for network test:
$ node test/server
$ node test/client  # in other cli
```

## Changelog

+ 1.1.0: add cache for result by default

## License

[MIT](LICENSE)
