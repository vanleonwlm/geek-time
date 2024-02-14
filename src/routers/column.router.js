const express = require('express');
const router = express.Router();
const nunjucks = require('../configs/nunjucks.config');
const moment = require('moment');

const columnService = require('../services/column.service');

router.get('/columns', (req, res) => {
    columnService.list((err, columns) => {
        if (err) {
            res.send({error: err.message});
            return;
        }

        columns.forEach(column => {
            column.create_time = moment(column.create_time).format('YYYY年M月D日');

            const author = JSON.parse(column.author_json);
            column.author = author;
        });

        const html = nunjucks.render('columns.html', {columns: columns});
        res.send(html);
    });
});

router.get('/columns/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    columnService.get(id, (err, column) => {
        if (err) {
            res.send({error: err.message});
            return;
        }

        column.create_time = moment(column.create_time).format('YYYY年M月D日');
        column.column = column;

        const html = nunjucks.render('column.html', column);
        res.send(html);
    });
});

module.exports = router;
