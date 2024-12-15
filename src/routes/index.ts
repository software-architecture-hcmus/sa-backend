import { Express } from "express";

import loggerMiddleware from "../lib/middlewares/logger.middleware";
import authenticationMiddleware from "../lib/middlewares/authentication.middleware";
import notFoundMiddleware from "../lib/middlewares/not-found.middleware";
import filterExceptionMiddleware from "../lib/middlewares/filter-exception.middleware";

import users from './users.r';

const initRoutes = async (app: Express) => {
    app.use(loggerMiddleware);
    app.use(authenticationMiddleware);
    app.use('/users', users);
    app.use('*', notFoundMiddleware);
    app.use(filterExceptionMiddleware);
}

export default initRoutes;