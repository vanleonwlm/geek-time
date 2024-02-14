const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const staticMiddleware = require('./static.middleware');

app.use(cookieParser());
app.use(staticMiddleware);

module.exports = app;
