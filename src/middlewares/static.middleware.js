const express = require('express');
const app = express();
const env = require('../configs/base.config')

const options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['css', 'js'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now());
    }
};

app.use(express.static(env.staticDirPath, options));

module.exports = app;
