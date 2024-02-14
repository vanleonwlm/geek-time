const express = require('express');
const router = express.Router();
const env = require('../configs/base.config');
const refer = env.geekTime.home;
const cookie = env.geekTime.cookie;
const unirest = require('unirest');
const puppeteer = require('puppeteer');
const moment = require('moment');
const mysql = require(`mysql-await`);
require('dotenv').config();
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    charset: 'utf8mb4'
});

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
const random = function (seed) {
    return Math.ceil(Math.random() * seed);
}

router.get('/crawl-columns', async (req, res) => {
    try {
        const columnIdsQuery = req.query.columnIds;
        const columnIds = columnIdsQuery ? columnIdsQuery.split(',') : [];
        main(columnIds);
    } catch (err) {
        console.log('crawl columns, err', err);
    }

    res.send({
        message: 'crawling, please wait a moment...'
    });
});

async function main(columnIds = []) {
    if (columnIds && columnIds.length > 0) {
        for (let i = 0; i < columnIds.length; i++) {
            const id = columnIds[i];
            const column = await getColumn(id);
            await crawl(column);
        }
    } else {
        let page = 1;
        const size = 20;
        let columns = [];
        let more = false;
        do {
            const ret = await listColumns(page, size);
            columns = ret.columns;
            more = ret.more;
            for (let i = 0; i < columns.length; i++) {
                const column = columns[i];
                await crawl(column);
            }
            page++;
        } while (more);
    }
}

async function listColumns(page, size) {
    const columns = [];
    let more = false;
    await unirest('POST', 'https://time.geekbang.com/serv/v4/pvip/product_list')
        .headers({
            'Referer': refer,
            'Content-Type': 'application/json',
            'Cookie': cookie,
        })
        .send(JSON.stringify({
            "prev": page,
            "size": size,
            "tag_ids": [],
            "product_type": 1,
            "product_form": 1,
            "pvip": 0,
            "sort": 1,
            "with_articles": false
        }))
        .then(function (res) {
            if (res.error) {
                console.error(`list columns error, req: page = ${page}, size = ${size}`, res.error);
                throw new Error(res.error);
            }

            const body = JSON.parse(res.raw_body);
            const products = body.data.products || [];
            more = body.data.pate.more;

            products.forEach(product => {
                // I guess
                const isPVip = product.in_pvip === 1;
                if (!isPVip) {
                    return;
                }

                const create_time = moment(product.begin_time * 1000).format('YYYY-MM-DD HH:mm:ss');
                const update_time = moment(product.end_time * 1000).format('YYYY-MM-DD HH:mm:ss');
                const column = {
                    id: product.id,
                    create_time: create_time,
                    update_time: update_time,
                    title: product.title,
                    subtitle: product.subtitle,
                    intro: product.intro,
                    intro_html: product.intro_html,
                    cover_json: JSON.stringify(product.cover),
                    tags: product.seo.keywords.join(','),
                    author_json: JSON.stringify(product.author),
                    is_finish: product.is_finish || product.is_finish === true ? 'Y' : 'N',
                };
                columns.push(column);
            });
        });
    return {
        more: more,
        columns: columns
    };
}

async function getColumn(id) {
    let column;
    await unirest('POST', 'https://time.geekbang.com/serv/v3/column/info')
        .headers({
            'Referer': refer,
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Cookie': cookie,
        })
        .send(JSON.stringify({"product_id": id, "with_recommend_article": true}))
        .then(function (res) {
            const body = JSON.parse(res.raw_body);
            if (body.error && body.error.code) {
                console.error(`get column error, req: id = ${id}`, body.error);
                throw new Error(res.error);
            }
            const product = body.data;

            const create_time = moment(product.begin_time * 1000).format('YYYY-MM-DD HH:mm:ss');
            const update_time = moment(product.end_time * 1000).format('YYYY-MM-DD HH:mm:ss');
            column = {
                id: product.id,
                create_time: create_time,
                update_time: update_time,
                title: product.title,
                subtitle: product.subtitle,
                intro: product.intro,
                intro_html: product.intro_html,
                cover_json: JSON.stringify(product.cover),
                tags: product.seo.keywords.join(','),
                author_json: JSON.stringify(product.author),
                is_finish: product.is_finish || product.is_finish === true ? 'Y' : 'N',
            };
        });
    return column;
}

async function crawl(column) {
    console.log(`🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱 - ${column.id} - ${column.title} - 🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱`);

    const columnDB = await getColumnFromDB(column.id);
    if (columnDB && columnDB.is_finish === 'Y') {
        console.log('skip column', column.id, column.title);
        return;
    }

    const isFinish = column.is_finish;
    if (!columnDB) {
        column.is_finish = 'N';
        await insertColumn(column);
    }

    const chapters = await listChapters(column.id);
    chapters.forEach(chapter => {
        saveChapter(chapter);
    });

    const browser = await puppeteer.launch({
        headless: 'new'
    });

    const articleIds = await listArticleIds(column.id);
    for (let i = 0; i < articleIds.length; i++) {
        const articleId = articleIds[i];
        const articleDB = await getArticleFromDB(articleId);
        if (articleDB) {
            console.log('skip article', articleDB.id, articleDB.title);
            continue;
        }

        // 随机 n 秒后再请求爬取下一篇内容，并且每隔一段时间，模拟浏览器请求主页一次，避免频繁请求极客时间查询文章详情的接口，否则当前 IP 针对该接口的请求会被拉黑
        const sleepSeconds = random(5) * 1000;
        await sleep(sleepSeconds);
        if (i % 5 === 0) {
            const page = await browser.newPage();
            await page.goto(refer);
        }

        await crawlArticle(articleId);
    }

    await browser.close();

    column.is_finish = isFinish;
    if (column.is_finish === 'Y') {
        await updateColumn(column);
    }
}

async function getColumnFromDB(columnId) {
    const rows = await pool.awaitQuery('select * from geek_column where id = ?', [columnId]);
    return rows[0];
}

async function insertColumn(column) {
    await pool.awaitQuery('insert into geek_column set ?', column);
    console.log('insert column success', column.id, column.title);
}

async function updateColumn(column) {
    await pool.awaitQuery('update geek_column set ? where id = ?', [column, column.id]);
    console.log('update column success', column.id, column.title);
}

async function listChapters(columnId) {
    const chapters = [];
    await unirest('POST', 'https://time.geekbang.com/serv/v1/chapters')
        .headers({
            'Referer': refer,
            'Content-Type': 'application/json',
            'Cookie': cookie,
        })
        .send(JSON.stringify({
            "cid": columnId
        }))
        .then(function (res) {
            if (res.error) {
                console.error(`list chapters error, req: columnId = ${columnId}`, res.error);
                throw new Error(res.error);
            }

            const body = JSON.parse(res.raw_body);
            const items = body.data || [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const chapter = {
                    id: item.id,
                    title: item.title,
                    rank: i + 1,
                    column_id: columnId
                };
                chapters.push(chapter);
            }
        });
    return chapters;
}

async function saveChapter(chapter) {
    const rows = await pool.awaitQuery('select count(*) as num from geek_chapter where id = ?', [chapter.id]);
    const notFound = rows[0].num === 0;
    if (notFound) {
        await pool.awaitQuery('insert into geek_chapter set ?', chapter);
        console.log('insert chapter success', chapter.id, chapter.column_id, chapter.title, chapter.rank);
    }
}

async function listArticleIds(columnId) {
    const articleIds = [];
    await unirest('POST', 'https://time.geekbang.com/serv/v1/column/articles')
        .headers({
            'Referer': refer,
            'Content-Type': 'application/json',
            'Cookie': cookie,
        })
        .send(JSON.stringify({
            "cid": `${columnId}`,
            "size": 500,
            "prev": 0,
            "order": "earliest",
            "sample": false
        }))
        .then((res) => {
            if (res.error) {
                console.error(`list articles error, req: columnId = ${columnId}`, res.error);
                throw new Error(res.error);
            }

            const body = JSON.parse(res.raw_body);
            const articles = body.data.list || [];
            for (let i = 0; i < articles.length; i++) {
                const article = articles[i];
                articleIds.push(article.id);
            }
        });
    return articleIds;
}

async function crawlArticle(articleId) {
    const article = await getArticle(articleId);
    await saveArticle(article);
}

async function getArticleFromDB(articleId) {
    const rows = await pool.awaitQuery('select * from geek_article where id = ?', [articleId]);
    return rows[0];
}

async function getArticle(articleId) {
    let article;
    await unirest('POST', 'https://time.geekbang.com/serv/v1/article')
        .headers({
            'Referer': `https://time.geekbang.com/column/article/${articleId}`,
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Content-Type': 'application/json',
            'Cookie': cookie,
        })
        .send(JSON.stringify({
            "id": `${articleId}`,
            "include_neighbors": true,
            "is_freelyread": true
        }))
        .then((res) => {
            if (res.error) {
                console.error(`get article error, req:, articleId = ${articleId}`, res.error);
                throw new Error(res.error);
            }

            const body = JSON.parse(res.raw_body);
            if (body.code === -1) {
                console.log(`get article error, cookie expire, req: articleId = ${articleId}`);
                throw new Error('cookie expire');
            }

            const geekArticle = body.data;
            const create_time = moment(geekArticle.article_ctime * 1000).format('YYYY-MM-DD HH:mm:ss');
            article = {
                id: articleId,
                create_time: create_time,
                update_time: create_time,
                title: geekArticle.article_title,
                subtitle: geekArticle.article_subtitle,
                intro: geekArticle.article_summary,
                intro_html: geekArticle.article_cshort,
                content: null,
                content_html: geekArticle.article_content,
                column_id: geekArticle.product_id || data.sku,
                chapter_id: geekArticle.chapter_id
            };
        });
    return article;
}

async function saveArticle(article) {
    const rows = await pool.awaitQuery('select count(*) as num from geek_article where id = ?', [article.id]);
    const notFound = rows[0].num === 0;
    if (notFound) {
        await pool.awaitQuery('insert into geek_article set ?', article);
        console.log('insert article success', article.column_id, article.id, article.title);
    } else {
        await pool.awaitQuery('update geek_article set ? where id = ?', [article, article.id]);
        console.log('update article success', article.column_id, article.id, article.title);
    }
}

module.exports = router;
