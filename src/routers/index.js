const express = require('express');
const app = express();
const router = express.Router();

const columnRouter = require('./column.router');
const articleRouter = require('./article.router');
const crawlerRouter = require('./crawler.router');
const markdownRouter = require('./markdown.router');

router.get('/', (req, res) => {
    res.redirect('/columns');
});

app.use(router);
app.use('/', columnRouter);
app.use('/', articleRouter);
app.use('/', crawlerRouter);
app.use('/', markdownRouter);

module.exports = app;
