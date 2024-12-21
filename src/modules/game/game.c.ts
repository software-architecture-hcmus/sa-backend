import { NextFunction, Request, Response } from "express";
import logger from "../../utils/logger";
import { ROLES } from "../../shared/constants/roles.constant";
import { RoleGuard } from "../../lib/decorators/role-guard.decorator";
import AppDataSource from "../../database/data-source";
import { CustomUserRequest } from "../../lib/interfaces/request.interface";


class GameController {
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            return res.status(200).json({ data: "getById" });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }
    async createGame(req: Request, res: Response, next: NextFunction) {
        try {
            return res.status(200).json({ data: "createGame" });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }
    async saveResult(req: Request, res: Response, next: NextFunction) {
        try {
            return res.status(200).json({ data: "saveResult" });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    async createQuestion(req: Request, res: Response, next: NextFunction) {
        try {
            return res.status(200).json({ data: "createQuestion" });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    async deleteQuestion(req: Request, res: Response, next: NextFunction) {
        try {
            return res.status(200).json({ data: "deleteQuestion" });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    async updateQuestion(req: Request, res: Response, next: NextFunction) {
        try {
            return res.status(200).json({ data: "updateQuestion" });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }
}

export default new GameController;