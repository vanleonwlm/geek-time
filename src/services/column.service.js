const columnModel = require('../models/column.model');
const chapterModel = require('../models/chapter.model');
const articleModel = require('../models/article.model');
const async = require('async');

const columnInfoBgs = [
    'https://static001.geekbang.org/static/time/img/column-info-bg-1.a31c9cdf.png',
    'https://static001.geekbang.org/static/time/img/column-info-bg-2.2ba6423f.png',
    'https://static001.geekbang.org/static/time/img/column-info-bg-3.42a73e0a.png',
    'https://static001.geekbang.org/static/time/img/column-info-bg-4.950eba41.png',
    'https://static001.geekbang.org/static/time/img/column-info-bg-5.d770d38f.png',
];

module.exports = {
    list: (callback) => {
        columnModel.list((err, columns) => {
            callback(err, columns);
        });
    },

    get: (id, callback) => {
        async.parallel([
            function (_callback) {
                columnModel.get(id, (err, column) => {
                    _callback(err, column);
                });
            },
            function (_callback) {
                chapterModel.list(id, (err, chapters) => {
                    _callback(err, chapters);
                });
            },
            function (_callback) {
                articleModel.list(id, (err, articles) => {
                    _callback(err, articles);
                });
            }
        ], (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }

            const _column = result[0];
            const _chapters = result[1];
            const _articles = result[2];

            if (!_column) {
                callback(new Error('column is not exist'), null);
                return;
            }

            const column = assembleColumn(_column, _chapters, _articles);
            callback(null, column);
        });
    },
}


const assembleColumn = (column, chapters, articles) => {
    if (chapters && chapters.length === 0) {
        column.articles = articles;
    } else {
        const chapterIdToArticlesMap = new Map();
        articles.forEach(article => {
            const chapterId = article.chapter_id;
            let _articles = chapterIdToArticlesMap.get(chapterId);
            if (_articles == null) {
                _articles = [];
            }
            _articles.push(article);
            chapterIdToArticlesMap.set(chapterId, _articles);
        });

        chapters.forEach(chapter => {
            const articles = chapterIdToArticlesMap.get(chapter.id);
            chapter.articles = articles || [];
        });

        column.chapters = chapters;
    }

    column.author = JSON.parse(column.author_json);
    column.background = columnInfoBgs[parseInt(column.id / 100) % columnInfoBgs.length];
    column.cover = JSON.parse(column.cover_json);

    return column;
}
