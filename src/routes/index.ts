import { Express } from "express";

import loggerMiddleware from "../lib/middlewares/logger.middleware";
import authenticationMiddleware from "../lib/middlewares/authentication.middleware";
import notFoundMiddleware from "../lib/middlewares/not-found.middleware";
import filterExceptionMiddleware from "../lib/middlewares/filter-exception.middleware";

import users from './users.r';
import { API_VERSION } from "../shared/constants/api-version.constant";

const initRoutes = async (app: Express) => {
    app.use(loggerMiddleware);
    app.use(authenticationMiddleware);
    app.use(`/api/${API_VERSION.V1}/users`, users);
    app.use('*', notFoundMiddleware);
    app.use(filterExceptionMiddleware);
}

export default initRoutes;