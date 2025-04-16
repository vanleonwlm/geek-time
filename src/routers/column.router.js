import express from 'express';
const router = express.Router();
import columnService from '../services/column.service.js';
import nunjucks from '../configs/nunjucks.config.js';
import { parseInt } from '../utils/common.utils.js';

router.get(['/columns', '/'], async (req, res) => {
    const columns = await columnService.list();
    const html = nunjucks.render('columns.html', { columns });
    res.send(html);
});

router.get('/columns/:id', async (req, res) => {
    const id = parseInt(req.params.id, 0);
    const column = await columnService.get(id);
    if (!column) {
        res.status(404).send('Column not found');
        return;
    }
    column.column = column;
    const html = nunjucks.render('column.html', column);
    res.send(html);
});

export default router;
