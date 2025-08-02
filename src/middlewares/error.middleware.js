import express from 'express';
import {redirectErrorPage} from "../utils/common.utils.js";

const app = express();

app.use((req, res, next) => {
    const err = new Error();
    err.status = 404;
    err.message = '页面不存在'
    next(err);
});

app.use((err, req, res, next) => {
    redirectErrorPage(req, res, err)
});

export default app;