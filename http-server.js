const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config.js');
const compiler = webpack(config);

const path = require('path');
const fs = require('fs');

app.use(cookieParser());
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/', express.static(path.join(__dirname, 'dist')));

app.use(
    webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
    })
)

app.get('/', (req, res) => {
    res.redirect(301, '/crazy-parking-lot');
}); 

app.get('/crazy-parking-lot', (req, res) => {

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

app.get(/^\/tile/, (req, res) => {
    fs.readFile(__dirname + req.originalUrl, (err, data) => {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        });
        res.end(data);
    });
});

app.listen(port, () => {
    console.log('web view server run on port : ' + port);
});