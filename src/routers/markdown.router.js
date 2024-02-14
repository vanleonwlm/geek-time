const express = require('express');
const router = express.Router();
const db = require('../configs/database.config');
const fs = require('fs');
const path = require('path');
const turndown = require('turndown');
const turndownService = new turndown();

router.get('/generator-markdowns', (req, res) => {
    db.query('select * from `column` order by id', (err, columns) => {
        if (err) {
            res.send({error: err.message});
            return;
        }

        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (!column) {
                continue;
            }

            const columnDir = path.join(__dirname, 'markdown', column.title.replaceAll('/', '-'));
            if (!fs.existsSync(columnDir)) {
                fs.mkdirSync(columnDir);
                console.log(`create column dir: ${columnDir}`);
            }

            db.query('select * from chapter where column_id = ? order by `rank`', [column.id], (err, chapters) => {
                if (err) {
                    res.send({error: err.message});
                    return;
                }

                if (!chapters) {
                    return;
                }

                const existChapters = chapters.length > 0;
                const chapterDirMap = new Map();
                for (let j = 0; j < chapters.length; j++) {
                    const chapter = chapters[j];
                    const chapterDir = path.join(columnDir, `${j + 1}-${chapter.title.replaceAll('/', '-')}`);
                    chapterDirMap.set(chapter.id, chapterDir);
                    if (!fs.existsSync(chapterDir)) {
                        fs.mkdirSync(chapterDir);
                        console.log(`create chapter dir: ${columnDir}`);
                    }
                }

                db.query('select * from article where column_id = ? order by create_time', [column.id], (error, articles) => {
                    if (!articles) {
                        return;
                    }

                    for (let k = 0; k < articles.length; k++) {
                        const article = articles[k];
                        if (!article) {
                            continue;
                        }

                        let articleFile;
                        const title = article.title.replaceAll('/', '-');
                        if (existChapters) {
                            const chapterDir = chapterDirMap.get(article.chapter_id);
                            articleFile = path.join(chapterDir, title + '.md');
                        } else {
                            articleFile = path.join(columnDir, title + '.md');
                        }

                        const articleMarkdown = turndownService.turndown(article.content_html);
                        fs.writeFileSync(articleFile, articleMarkdown);
                        console.log(`create article file: ${articleFile}`);
                    }
                });
            });
        }
        res.send({
            message: 'creating, please wait a moment...'
        });
    });
});

module.exports = router;
