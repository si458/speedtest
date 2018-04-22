const express = require('express');
const Server = express();
const randomBytes = require('random-bytes');
const path = require('path');

let cache = {
    size: 0,
    random: null
};

Server.get('/empty', function (req, res) {
    res.sendStatus(200);
});

Server.post('/empty', function (req, res) {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    res.set("Cache-Control", "post-check=0, pre-check=0");
    res.set("Pragma", "no-cache");
    res.sendStatus(200);
});

Server.get('/garbage', function (req, res) {
    res.set('Content-Description', 'File Transfer');
    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', 'attachment; filename=random.dat');
    res.set('Content-Transfer-Encoding', 'binary');
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.set('Cache-Control', 'post-check=0, pre-check=0', false);
    res.set('Pragma', 'no-cache');
    const requestedSize = (req.query.ckSize || 100);
    if (cache.size === requestedSize) {
        res.end(cache.random);
    } else {
        const size = 1048576 * (req.query.ckSize || 100);
        randomBytes(size, (error, bytes) => {
            if (error) res.sendStatus(500);
            else {
                cache.random = bytes;
                cache.size = (req.query.ckSize || 100);
                res.end(bytes);
            }
        })
    }

});

Server.get('/getIP', function (req, res) {
    res.send(req.headers['x-forwarded-for'] || req.connection.remoteAddress)
});

Server.use(express.static(path.join(__dirname, 'public')));

Server.listen(8888);
