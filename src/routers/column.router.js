import express from 'express';
const router = express.Router();
import columnService from '../services/column.service.js';
import nunjucks from '../configs/nunjucks.config.js';

router.get(['/columns', '/'], async (req, res) => {
    const columns = await columnService.list();
    const html = nunjucks.render('columns.html', { columns });
    res.send(html);
});

router.get('/columns/:id', async (req, res) => {
    const id = Number.parseInt(req.params.id);
    const column = await columnService.get(id);
    column.column = column;
    const html = nunjucks.render('column.html', column);
    res.send(html);
});

export default router;
