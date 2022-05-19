const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3001;

const path = require('path');
const fs = require('fs');

app.use(cookieParser());
app.use('/lib', express.static(path.join(__dirname, 'lib')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.get('/', (req, res) => {
    res.redirect(301, '/webview/crazy-parking-lot');
}); 

app.get('/webview/crazy-parking-lot', (req, res) => {

    //res.clearCookie('webView');
    //res.cookie('webView', req.cookies);
    res.sendFile(path.join(__dirname, './dist/index.html'));
});


// image download
app.get(/^\/assets/, (req, res) => {
    fs.readFile(__dirname + req.originalUrl, (err, data) => {
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': data.length
        });
        res.end(data);
    });
});

app.get(/^\/grid/, (req, res) => {
    fs.readFile(__dirname + req.originalUrl, (err, data) => {
        res.writeHead(200, {
            'Content-Type': 'text/csv',
            'Content-Length': data.length
        });
        res.end(data);
    });
});

app.listen(port, () => {
    console.log('web view server run on port : ' + port);
});