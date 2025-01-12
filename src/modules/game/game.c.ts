import { NextFunction, Request, Response } from "express";
import logger from "../../utils/logger";
import { ROLES } from "../../shared/constants/user-roles.constant";
import { RoleGuard } from "../../lib/decorators/role-guard.decorator";
import AppDataSource from "../../database/data-source";
import { CustomUserRequest } from "../../lib/interfaces/request.interface";
import GameService from "./game.s";

class GameController {
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const game = await GameService.getById(req.params.id);
            return res.status(200).json({ data: game });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const games = await GameService.getAll();
            return res.status(200).json({ data: games });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    @RoleGuard([ROLES.ADMIN, ROLES.BUSINESS])
    async createGame(req: Request, res: Response, next: NextFunction) {
        try {
            const _req = req as CustomUserRequest;
            if (!_req.body.brand_id) {
                req.body.brand_id = _req.user.uid;
            }
            const { name, type, allow_voucher_exchange, instruction, status, started, event, brand_id } = req.body;

            const createGameData = {
                name,
                type,
                allow_voucher_exchange,
                instruction,
                status,
                started,
                event,
                brand_id
            };
            let game;
            if (type === "QUIZ") {
                createGameData["questions"] = req.body.questions;
                game = await GameService.createGameQuiz(createGameData);
            } else if (type === "FLAPPYBIRD") {
                createGameData["play_count"] = req.body.play_count;
                game = await GameService.createGameFlappyBird(createGameData);
            }
            return res.status(201).json({ data: game });
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
    
    @RoleGuard([ROLES.ADMIN, ROLES.BUSINESS])
    async getDefault(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await GameService.getDefault();
            return res.status(200).json({ data: data });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    @RoleGuard([ROLES.ADMIN, ROLES.BUSINESS])
    async updateDefault(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.body;
            const data = req.body;
            const game = await GameService.updateDefault(id, data);
            return res.status(200).json({ data: game });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }
}

export default new GameController;