const articleModel = require('../models/article.model');
const columnService = require('./column.service');

module.exports = {
    get: (id, callback) => {
        articleModel.get(id, (err, article) => {
            if (err) {
                callback(err, null);
                return;
            }

            if (!article) {
                callback(new Error('article is not exist'), null);
                return;
            }

            const columnId = article.column_id;
            columnService.get(columnId, (err, column) => {
                if (err) {
                    callback(err, null);
                    return;
                }

                article.column = column;

                const articles = getArticles(column);
                article.prev = getPrevArticle(id, articles);
                article.next = getNextArticle(id, articles);

                callback(null, article);
            })
        });
    },
}

const getArticles = (column) => {
    if (column.chapters) {
        const articles = [];
        for (const chapter of column.chapters) {
            for (const article of chapter.articles) {
                articles.push(article);
            }
        }
        return articles;
    }
    return column.articles || [];
}

const getPrevArticle = (id, articles) => {
    const index = findArticleIndex(id, articles);
    const prevIndex = index - 1;
    if (prevIndex < 0) {
        return null;
    }
    return articles[prevIndex];
}

const getNextArticle = (id, articles) => {
    const index = findArticleIndex(id, articles);
    const nextIndex = index + 1;
    if (nextIndex > articles.length) {
        return null;
    }
    return articles[nextIndex];
}

const findArticleIndex = (id, articles) => {
    for (let i = 0; i < articles.length; i++) {
        if (articles[i].id === id) {
            return i;
        }
    }
    return -1;
}
