
import columnRouter from './column.router.js';
import articleRouter from './article.router.js';

const registerRoutes = (app) => {
    app.use('/', columnRouter);
    app.use('/', articleRouter);
};

export default registerRoutes;
