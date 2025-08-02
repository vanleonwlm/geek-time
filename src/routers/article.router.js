import express from 'express';
import articleService from '../services/article.service.js';
import nunjucks from '../configs/nunjucks.config.js';
import {parseInt, redirectErrorPage} from '../utils/common.utils.js';

const router = express.Router();

router.get('/articles/:id', async (req, res) => {
    const id = parseInt(req.params.id, 0);
    const article = await articleService.get(id);
    if (!article) {
        redirectErrorPage(req, res, {message: '文章不存在'})
        return;
    }
    const html = nunjucks.render('article.html', article);
    res.send(html);
});

export default router;
