import express from 'express';
import session from 'express-session';

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

export default app;