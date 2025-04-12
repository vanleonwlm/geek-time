import columnService from "./column.service.js";
import Article from "../models/article.model.js";

const get = async (id) => {
    const _article = await Article.get(id);
    const article = _article.get({ plain: true });

    if (!article) {
        throw new Error(`Article not found: ${id}`);
    }

    const column = await columnService.get(article.columnId);
    const articles = getArticles(column);
    
    article.column = column;
    article.prev = getPrevArticle(id, articles);
    article.next = getNextArticle(id, articles);

    return article;
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

export default {
    get
}
