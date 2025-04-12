import GeekTimeSpider from './services/geek-time-spider.service.js';

const spider = new GeekTimeSpider({
    skipArticleIfExists: true,
    columnIds: []
});

console.log('spider start');

await spider.start();

console.log('spider finished');
