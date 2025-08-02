import loginRouter from "./login.router.js";
import columnRouter from './column.router.js';
import articleRouter from './article.router.js';
import errorMiddleware from "../middlewares/error.middleware.js";

const registerRoutes = (app) => {
    app.use('/', loginRouter);
    app.use('/', columnRouter);
    app.use('/', articleRouter);

    app.use('/', errorMiddleware);
};

export default registerRoutes;
