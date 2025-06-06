import HttpUtils from '../utils/http.utils.js';
import { GEEK_TIME_HOME } from '../configs/geek-time.config.js';
import { COLUMN_FORMS } from '../configs/column.config.js';
import env from '../configs/env.config.js';

const geekTimeCookie = env.geekTime.cookie;

class GeekTimeService {
    constructor() {
        this.http = new HttpUtils();
        this.baseUrl = GEEK_TIME_HOME;
        this.headers = {
            'Referer': GEEK_TIME_HOME,
            'Content-Type': 'application/json',
            'Cookie': geekTimeCookie,
            'User-Agent': 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
        };
    }

    async listColumns(page = 1, size = 20, productType = 0, productForm = 0) {
        const url = `${this.baseUrl}/serv/v4/pvip/product_list`;
        const data = {
            prev: page - 1,
            size: size,
            tag_ids: [],
            product_type: productType,
            product_form: productForm,
            pvip: 0,
            sort: 1,
            with_articles: false
        }
        return this.http.post(url, data, this.headers);
    }

    async listDailyCourseColumns(prev = 0, size = 20) {
        const url = `${this.baseUrl}/serv/v3/product/list`;
        const data = { "type": "d", "size": size, "prev": prev, "orderby": "new" };
        return this.http.post(url, data, this.headers);
    }

    async getColumnInfo(productId) {
        const url = `${this.baseUrl}/serv/v3/column/info`;
        const data = {
            product_id: productId,
            with_recommend_article: false
        };
        return this.http.post(url, data, this.headers);
    }

    async listChapters(columnId) {
        const url = `${this.baseUrl}/serv/v1/chapters`;
        const data = { cid: columnId };
        return this.http.post(url, data, this.headers);
    }

    async listArticles(columnId, size = 500, prev = 0) {
        const url = `${this.baseUrl}/serv/v1/column/articles`;
        const data = {
            cid: `${columnId}`,
            size: size,
            prev: prev,
            order: "earliest",
            sample: false
        };
        return this.http.post(url, data, this.headers);
    }

    /**
     * 获取文章信息
     * 
     * 使用product_type区分专栏和视频课
     * 专栏课地址：https://time.geekbang.com/column/intro/101023401 v1
     * 视频课地址：https://time.geekbang.com/course/intro/101000501 v3
     * 公开课地址：https://time.geekbang.com/opencourse/videointro/100838801 v3 product_type=4
     * 
     * 
     * @param {*} articleId 文章ID
     * @param {*} columnForm 专栏类型
     * @returns 
     */
    async getArticle(articleId, columnForm) {
        const url = columnForm === COLUMN_FORMS.video
            ? `${this.baseUrl}/serv/v3/article/info`
            : `${this.baseUrl}/serv/v1/article`;
        const id = columnForm === COLUMN_FORMS.video ? articleId : `${articleId}`;
        const data = {
            id: id
        };
        const headers = {
            ...this.headers,
            'Referer': `https://time.geekbang.com/column/article/${articleId}`
        };
        return this.http.post(url, data, headers);
    }
}

export default new GeekTimeService();
