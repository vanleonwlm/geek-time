import express from 'express';
const router = express.Router();
import articleService from '../services/article.service.js';
import nunjucks from '../configs/nunjucks.config.js';
import { parseInt } from '../utils/common.utils.js';

router.get('/articles/:id', async (req, res) => {
    const id = parseInt(req.params.id, 0);
    const article = await articleService.get(id);
    if (!article) {
        res.status(404).send('Article not found');
        return;
    }
    const html = nunjucks.render('article.html', article);
    res.send(html);
});

export default router;
