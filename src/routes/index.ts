import { Express } from "express";

import loggerMiddleware from "../lib/middlewares/logger.middleware";
import authenticationMiddleware from "../lib/middlewares/authentication.middleware";
import notFoundMiddleware from "../lib/middlewares/not-found.middleware";
import filterExceptionMiddleware from "../lib/middlewares/filter-exception.middleware";

import users from './users.r';  
import events from './events.r';
import game from './game.r';
import business from './business.r';
import voucher from './voucher.r'
import favourites from './favourite.r';
import notifications from './notifications.r';
import { API_VERSION } from "../shared/constants/api-version.constant";
import { uploadMultiple } from "../lib/middlewares/upload.middleware";
import uploadController from '../shared/upload/upload';

const initRoutes = async (app: Express) => {
    app.use(loggerMiddleware);
    app.use(authenticationMiddleware);
    app.use(`/api/${API_VERSION.V1}/upload`, uploadMultiple('files'), uploadController.upload);
    app.use(`/api/${API_VERSION.V1}/users`, users);
    app.use(`/api/${API_VERSION.V1}/events`, events);
    app.use(`/api/${API_VERSION.V1}/games`, game);
    app.use(`/api/${API_VERSION.V1}/business`, business);
    app.use(`/api/${API_VERSION.V1}/vouchers`, voucher);
    app.use(`/api/${API_VERSION.V1}/favourites`, favourites);
    app.use(`/api/${API_VERSION.V1}/notifications`, notifications);
    app.use('*', notFoundMiddleware);
    app.use(filterExceptionMiddleware);
}

export default initRoutes;