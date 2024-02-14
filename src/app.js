const express = require('express');
const app = express();
const middlewares = require('./middlewares');
const router = require('./routers');
require('dotenv').config();

app.use(middlewares);
app.use(router);

app.listen(process.env.PORT, () => {
    console.log('geek-time is running...');
    console.log('env:', process.env);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // process.exit(1);
});

module.exports = app;
