import puppeteer from 'puppeteer';
import GeekTimeService from './geek-time.service.js';
import Column from '../models/column.model.js';
import Chapter from '../models/chapter.model.js';
import Article from '../models/article.model.js';
import { GEEK_TIME_HOME } from '../configs/geek-time.config.js';
import { random, sleep } from '../utils/common.utils.js';
import { COLUMN_FORMS } from '../configs/column.config.js';

class GeekTimeSpider {
    
    constructor(config = {}) {
        this.config = {
            headless: 'new',
            maxRetries: 3,
            retryDelay: 5000,
            batchSize: 20,
            isSpiderDailyCourse: false,
            columnIds: [],
            skipColumnIfFinish: false,
            skipArticleIfExists: false,
            productType: 0,
            productForm: 0,
            ...config
        };
        this.browser = null;
        this.isRunning = false;
        this.notPurchasedColumnIds = [];
    }

    async start() {
        if (this.isRunning) {
            console.warn('Spider is already running, please wait for it to finish');
            return;
        }

        try {
            this.isRunning = true;
            this.browser = await puppeteer.launch({
                headless: this.config.headless
            });

            if (this.config.isSpiderDailyCourse) {
                await this.spiderDailyCourseColumns();
            } else {
                await this.spiderColumns(1, this.config.batchSize);
            }
        } catch (error) {
            console.error('Failed to start spider:', error);
            throw error;
        } finally {
            await this.cleanup();
        }
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
        this.isRunning = false;
    }

    async withRetry(operation, retries = this.config.maxRetries) {
        for (let i = 0; i < retries; i++) {
            try {
                return await operation();
            } catch (error) {
                if (i === retries - 1) throw error;
                console.warn(`Operation failed, retrying (${i + 1}/${retries}):`, error);
                await sleep(this.config.retryDelay);
            }
        }
    }

    async spiderColumns(page = 1, size = 50) {
        try {
            const listColumnsResponse = await this.withRetry(() => 
                GeekTimeService.listColumns(page, size, this.config.productType, this.config.productForm)
            );

            if (listColumnsResponse.code === 0) {
                const geekTimeColumns = listColumnsResponse.data.products;
                for (const geekTimeColumn of geekTimeColumns) {
                    await this.spiderColumn(geekTimeColumn);
                }

                const hasMore = listColumnsResponse.data.page.more;
                if (hasMore) {
                    await this.spiderColumns(page + 1, size);
                }
            } else {
                throw new Error(`Failed to fetch columns: ${listColumnsResponse.error.msg || 'unknown error'}`);
            }
        } catch (error) {
            console.error(`Failed to spider columns page ${page}:`, error);
            throw error;
        }
    }

    async spiderDailyCourseColumns(prev = 0, size = 100) {
        try {
            const listDailyCourseColumnsResponse = await this.withRetry(() =>
                GeekTimeService.listDailyCourseColumns(prev, size)
            );

            if (listDailyCourseColumnsResponse.code === 0) {
                const geekTimeDailyCourseColumns = listDailyCourseColumnsResponse.data.list;
                for (const [index, geekTimeDailyCourseColumn] of geekTimeDailyCourseColumns.entries()) {
                    await this.simulateUserAccessGeekTimeHomePage(index);

                    geekTimeDailyCourseColumn.is_video = true;
                    await this.spiderColumn(geekTimeDailyCourseColumn);
                    await this.spiderArticle(geekTimeDailyCourseColumn.article.id, 
                        geekTimeDailyCourseColumn.id,
                        COLUMN_FORMS.video);
                }

                const page = listDailyCourseColumnsResponse.data.page;
                if (page.more) {
                    await this.spiderDailyCourseColumns(page.source + 1, size);
                }
            } else {
                throw new Error(`Failed to fetch daily course columns: ${listDailyCourseColumnsResponse.error.msg || 'unknown error'}`);
            }
        } catch (error) {
            console.error('Failed to spider daily course columns:', error);
            throw error;
        }
    }

    async spiderColumn(geekTimeColumn) {
        try {
            if (this.config.columnIds.length > 0 && !this.config.columnIds.includes(geekTimeColumn.id)) {
                return;
            }
            
            console.log('----------------------------------------------------------------');

            if (this.config.skipColumnIfFinish) {
                const column = await Column.get(geekTimeColumn.id);
                if (column && column.isFinish === 'Y') {
                    console.log(`Column is finished, skipping, id: ${geekTimeColumn.id}, title: ${geekTimeColumn.title}`);
                    return;
                }
            }

            const column = Column.fromGeekTime(geekTimeColumn);
            const isFinish = column.isFinish;
            column.isFinish = 'N';
            await Column.save(column);
            console.log(`Processing column, id: ${column.id}, title: ${column.title}`);

            const listChaptersResponse = await this.withRetry(() => 
                GeekTimeService.listChapters(column.id)
            );
            if (listChaptersResponse.code === 0) {
                const chapters = [];
                const geekTimeChapters = listChaptersResponse.data;
                for (const [index, geekTimeChapter] of geekTimeChapters.entries()) {
                    const chapter = Chapter.fromGeekTime(geekTimeChapter, index + 1, column.id);
                    await Chapter.save(chapter);
                    chapters.push(chapter);
                }
                console.log(`Found ${chapters.length} chapters for column: ${column.title}`);

                await this.spiderArticles(column.id, column.form);
            } else {
                throw new Error(`Failed to fetch chapters: ${listChaptersResponse.error.msg || 'unknown error'}`);
            }

            column.isFinish = isFinish;
            await Column.save(column);
        } catch (error) {
            console.error(`Failed to spider column ${geekTimeColumn.id}:`, error);
            throw error;
        }
    }

    async spiderArticles(columnId, columnForm) {
        try {
            const listArticlesResponse = await this.withRetry(() => 
                GeekTimeService.listArticles(columnId, 500)
            );
            if (listArticlesResponse.code === 0) {
                const geekTimeArticles = listArticlesResponse.data.list;
                for (const [index, geekTimeArticle] of geekTimeArticles.entries()) {
                    await this.processArticle(geekTimeArticle, columnId, columnForm, index);
                }
            } else {
                throw new Error(`Failed to fetch articles: ${listArticlesResponse.error.msg || 'unknown error'}`);
            }
        } catch (error) {
            console.error(`Failed to spider articles for column ${columnId}:`, error);
            throw error;
        }
    }

    async processArticle(geekTimeArticle, columnId, columnForm, index) {
        try {
            if (this.notPurchasedColumnIds.includes(columnId)) {
                console.warn(`Column ${columnId} has not purchased, skipping`);
                return;
            }

            if (this.config.skipArticleIfExists) {
                const article = await Article.get(geekTimeArticle.id);
                if (article) {
                    console.log(`Article ${geekTimeArticle.id} already exists, skipping`);
                    return;
                }
            }

            await this.simulateUserAccessGeekTimeHomePage(index);
            await this.spiderArticle(geekTimeArticle.id, columnId, columnForm);
        } catch (error) {
            console.error(`Failed to process article ${geekTimeArticle.id}:`, error);
            throw error;
        }
    }

    async simulateUserAccessGeekTimeHomePage(articleIndex) {
        const sleepSeconds = random(5) * 1000;
        await sleep(sleepSeconds);

        if (articleIndex % 5 === 0) {
            const page = await this.browser.newPage();
            try {
                await this.withRetry(() => 
                    page.goto(GEEK_TIME_HOME, {
                        timeout: 60000,
                        waitUntil: 'networkidle0'
                    })
                );
            } catch (error) {
                console.error('Failed to access home page:', error);
                console.warn('Continuing despite home page access failure');
            } finally {
                await page.close();
            }
        }
    }

    async spiderArticle(articleId, columnId, columnForm) {
        try {
            const geekTimeArticleResponse = await this.withRetry(() => 
                GeekTimeService.getArticle(articleId, columnForm)
            );

            if (geekTimeArticleResponse.code === 0) {
                const geekTimeArticle = geekTimeArticleResponse.data;
                const article = Article.fromGeekTime(geekTimeArticle, columnForm);
                if (!article) {
                    console.warn(`Article ${articleId} is not a valid article, skipping`);
                    return;
                }
                await this.parseVideoM3u8(article, geekTimeArticle);
                await Article.save(article);
                console.log(`Processed article, id: ${article.id}, title: ${article.title}`);
            } else if (geekTimeArticleResponse.error.code === -3371) {
                console.warn(`User has not purchased this column, articleId: ${articleId}`);
                this.notPurchasedColumnIds.push(columnId);
            } else {
                throw new Error(`Failed to fetch article: ${geekTimeArticleResponse.error.msg || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(`Failed to spider article ${articleId}:`, error);
            throw error;
        }
    }

    async parseVideoM3u8(article, geekTimeArticle) {
        if (article.isVideo === 'N') {
            return
        }
        
        const m3u8 = geekTimeArticle?.info?.video_preview?.medias?.[0]?.url;
        // TODO
    }
}

export default GeekTimeSpider;
