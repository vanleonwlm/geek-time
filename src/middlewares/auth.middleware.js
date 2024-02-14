const express = require('express');
const app = express();
const authenticationHelper = require('../helpers/authentication.helper');

app.use((req, res, next) => {
    authenticationHelper.checkAuthentication(req, res, (err, isAuthenticated) => {
        if (isAuthenticated) {
            next();
        } else {
            res.status(401).send('Unauthorized');
        }
    });
});

module.exports = app;
