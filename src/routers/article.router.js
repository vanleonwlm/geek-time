import express from 'express';
const router = express.Router();
import articleService from '../services/article.service.js';
import nunjucks from '../configs/nunjucks.config.js';

router.get('/articles/:id', async (req, res) => {
    const id = Number.parseInt(req.params.id);
    const article = await articleService.get(id);
    const html = nunjucks.render('article.html', article);
    res.send(html);
});

export default router;
