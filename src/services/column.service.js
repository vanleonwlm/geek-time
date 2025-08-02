import Column from '../models/column.model.js';
import Chapter from '../models/chapter.model.js';
import Article from '../models/article.model.js';
import moment from 'moment';
import { COLUMN_INFO_BG_URLS, FREE_COLUMN_IDS } from '../configs/column.config.js';

const list = async () => {
    const columns = [];

    const _columns = await Column.list();
    _columns.forEach(_column => {
        const column = _column.get({ plain: true });
        column.createTimeYMD = moment(column.createTime).format('YYYY年M月D日');
        const author = JSON.parse(column.authorJson);
        column.author = author;
        columns.push(column);
    });

    return columns;
}

const get = async (id) => {
    const [_column, _chapters, _articles] = await Promise.all([
        Column.get(id),
        Chapter.list(id),
        Article.list(id)
    ]);

    if (!_column) {
        return null;
    }

    const column = _column.get({ plain: true });
    const chapters = _chapters.map(chapter => chapter.get({ plain: true }));
    const articles = _articles.map(article => article.get({ plain: true }));
    return assembleColumn(column, chapters, articles);
}

const assembleColumn = (column, chapters, articles) => {
    const result = Object.assign({
        createTimeYMD: moment(column.createTime).format('YYYY年M月D日'),
        author: JSON.parse(column.authorJson),
        background: COLUMN_INFO_BG_URLS[parseInt(column.id / 100) % COLUMN_INFO_BG_URLS.length],
        cover: JSON.parse(column.coverJson)
    }, column);

    if (chapters && chapters.length === 0) {
        result.articles = articles;
    } else {
        const chapterIdToArticles = new Map();
        articles.forEach(article => {
            const chapterId = article.chapterId;
            let chapterArticles = chapterIdToArticles.get(chapterId);
            if (chapterArticles == null) {
                chapterArticles = [];
            }
            chapterArticles.push(article);
            chapterIdToArticles.set(chapterId, chapterArticles);
        });

        result.chapters = chapters.map(chapter => {
            const chapterId = column.isVideo === 'Y' ? chapter.sourceId : chapter.id;
            chapter.articles = chapterIdToArticles.get(chapterId) || [];
            return chapter;
        });
    }

    return result;
}

const isFreeColumn = (columnId) => {
    return FREE_COLUMN_IDS.includes(columnId);
}

const canBrowseColumn = (req, res, columnId) => {
    if (isFreeColumn(columnId)) {
        return true;
    }

    const user = req.session.user;
    if (!user) {
        return false;
    }

    return user.isVip === 'Y';
}

export default {
    list,
    get,
    isFreeColumn,
    canBrowseColumn,
}
