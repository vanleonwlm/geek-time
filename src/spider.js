import GeekTimeSpider from './services/geek-time-spider.service.js';

const spider = new GeekTimeSpider({
    isSpiderDailyCourse: false,
    columnIds: [],
    skipColumnIfFinish: false,
    skipArticleIfExists: false,
    productType: 0,
    productForm: 0,
});

console.log('spider start');
await spider.start();
console.log('spider finished');
