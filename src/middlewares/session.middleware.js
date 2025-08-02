import express from 'express';
import session from 'express-session';
import loginService from "../services/login.service.js";

const app = express();

app.use(
    session({
        secret: 'my-secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 30
        }
    })
);

app.use(async (req, res, next) => {
    await loginService.refreshSession(req, res);
    next();
});

export default app;