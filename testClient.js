'use strict';
const http = require('http');

const PORT = 8033;

function simReqs() {
    let i = 1e2;
    while (i-- > 0) {
        setTimeout(() => {
            let req = http.request({
                path: `/data?num=${Math.random() > 0.5 ? 1 : 2}`,
                port: PORT
            }, res => {
                let respData = '';
                res.on('data', chunk => respData += chunk);
                res.on('end', () => console.info(`client get ${respData}`))
            });

            req.end();
        },
            Math.floor(Math.random() * 1e4));
    }
}

simReqs();
