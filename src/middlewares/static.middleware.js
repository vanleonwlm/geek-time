import express from 'express';

const app = express();

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

app.use(express.static('public', options));

export default app;
