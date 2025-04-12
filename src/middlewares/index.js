import staticMiddleware from './static.middleware.js';

const registerMiddlewares = (app) => {
  app.use(staticMiddleware);
};

export default registerMiddlewares;
