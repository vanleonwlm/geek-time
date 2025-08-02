import express from 'express';
import columnService from '../services/column.service.js';
import nunjucks from '../configs/nunjucks.config.js';
import {parseInt, redirectErrorPage} from '../utils/common.utils.js';
import env from "../configs/env.config.js";

const router = express.Router();

router.get(['/columns', '/'], async (req, res) => {
    const oauth = {
        isLogin: !!req.session.user,
        loginUrl: `https://github.com/login/oauth/authorize?client_id=${env.github.oauth.clientId}&redirect_uri=${req.protocol}://${req.get('host')}/github/oauth/redirect`
    };

    let columns = await columnService.list();
    columns = columns.filter(column => {
        return columnService.canBrowseColumn(req, res, column.id);
    });

    const html = nunjucks.render('columns.html', {oauth, columns});
    res.send(html);
});

router.get('/columns/:id', async (req, res) => {
    const id = parseInt(req.params.id, 0);
    const column = await columnService.get(id);
    if (!column) {
        redirectErrorPage(req, res, {message: '专栏不存在'})
        return;
    }

    const canBrowse = columnService.canBrowseColumn(req, res, id);
    if (!canBrowse) {
        redirectErrorPage(req, res, {message: '专栏不存在'})
        return;
    }

    column.column = column;
    const html = nunjucks.render('column.html', column);
    res.send(html);
});

export default router;
