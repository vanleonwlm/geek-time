import loginRouter from "./login.router.js";
import columnRouter from './column.router.js';
import articleRouter from './article.router.js';

const registerRoutes = (app) => {
    app.use('/', loginRouter);
    app.use('/', columnRouter);
    app.use('/', articleRouter);
};

export default registerRoutes;
