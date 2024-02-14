const express = require('express');
const app = express();

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(200).send({error: err.message});
});

module.exports = app;
