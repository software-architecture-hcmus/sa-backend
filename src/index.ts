import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { config } from './config/configuration';
import initRoutes from './routes';
import logger from "./utils/logger";
import AppDataSource from "./database/data-source";
import { initSocketIO } from './lib/socket/gateway.socket';
import { initRedis } from './shared/redis/redis.service';

const app = express();

app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

AppDataSource.initialize()
    .then(() => {
        console.log(`🌟 Postgres connected`);
    })
    .catch(error => {
        logger.error("❌ Connect to database error: " + error.message);
        process.exit(0);
    })

initRoutes(app);
// connect redis
(async () => {
    try {
      await initRedis();
      logger.info('Redis connected successfully');
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
    }
  })();
const { server } = initSocketIO(app);

server.listen(config.PORT, (() => {
    console.log(`🚀 Server is running on http://localhost:${config.PORT}`);
}))