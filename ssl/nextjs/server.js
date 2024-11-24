const { createServer } = require('https');
const { parse } = require('url');
const fs = require('fs');
const next = require('next');

const sslDir = '../../../../ssl/';
const httpsOptions = {
    key: fs.readFileSync(`${sslDir}private.key`),
    cert: fs.readFileSync(`${sslDir}term-app.crt`),
    ca: fs.readFileSync(`${sslDir}term-app.ca-bundle`),
};

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

const port = 3000;

app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on https://localhost:${port}`);
    });
});