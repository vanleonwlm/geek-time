const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const staticMiddleware = require('./static.middleware');
const authMiddleware = require('./auth.middleware');

app.use(cookieParser());
app.use(staticMiddleware);
app.use(authMiddleware);

module.exports = app;
