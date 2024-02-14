const express = require('express');
const router = express.Router();
const nunjucks = require('../configs/nunjucks.config');

const articleService = require('../services/article.service');

router.get('/articles/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    articleService.get(id, (err, article) => {
        if (err) {
            res.send({error: err.message});
            return;
        }

        const html = nunjucks.render('article.html', article);
        res.send(html);
    });
});

module.exports = router;
