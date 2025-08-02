import express from 'express';
import env from './configs/env.config.js';
import {testConnection} from './configs/db.config.js';
import registerRoutes from './routers/index.js';
import registerMiddlewares from './middlewares/index.js';

const app = express();

await testConnection();

registerMiddlewares(app);
registerRoutes(app);

app.set('trust proxy', true)
app.listen(env.port, () => {
    console.log('geek-time is running...');
});
