import sessionMiddleware from './session.middleware.js';
import staticMiddleware from './static.middleware.js';

const registerMiddlewares = (app) => {
    app.use(sessionMiddleware);
    app.use(staticMiddleware);
};

export default registerMiddlewares;
