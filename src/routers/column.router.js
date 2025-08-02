import express from 'express';
import columnService from '../services/column.service.js';
import nunjucks from '../configs/nunjucks.config.js';
import {parseInt, redirectErrorPage} from '../utils/common.utils.js';

const router = express.Router();

router.get(['/columns', '/'], async (req, res) => {
    const columns = await columnService.list();
    const html = nunjucks.render('columns.html', {columns});
    res.send(html);
});

router.get('/columns/:id', async (req, res) => {
    const id = parseInt(req.params.id, 0);
    const column = await columnService.get(id);
    if (!column) {
        redirectErrorPage(req, res, {message: '专栏不存在'})
        return;
    }
    column.column = column;
    const html = nunjucks.render('column.html', column);
    res.send(html);
});

export default router;
