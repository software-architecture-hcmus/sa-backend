import { NextFunction, Request, Response } from "express";
import logger from "../../utils/logger";
import { ROLES } from "../../shared/constants/user-roles.constant";
import { RoleGuard } from "../../lib/decorators/role-guard.decorator";
import AppDataSource from "../../database/data-source";
import { CustomUserRequest } from "../../lib/interfaces/request.interface";
import UserService from "../users/users.s";
import GameService from "./game.s";
import { RequestTurn } from "../../database/entities/request_turns.entity";
import { GameTurns } from "../../database/entities/game_turns.entity";
import { TripleStatus } from "../../database/enums/triple-status.enum";

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
            const _req = req as CustomUserRequest;
            const games = await GameService.getAll({
                branch_id: _req.user.uid
            });
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
            const { name, type, allow_voucher_exchange, instruction, status, started, event, brand_id, image } = req.body;

            const createGameData = {
                name,
                type,
                allow_voucher_exchange,
                instruction,
                status,
                started,
                event,
                brand_id,
                image
            };
            let game;
            if (type === "QUIZ") {
                createGameData["questions"] = JSON.parse(req.body.questions);
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

    
    @RoleGuard([ROLES.ADMIN, ROLES.BUSINESS])
    async updateGame(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const data = req.body;
            let game;
            if (data.type === "QUIZ") {
                data.questions = JSON.parse(req.body.questions);
                console.log(data.questions[0]);
                game = await GameService.updateGameQuiz(id, data);
            } else if (data.type === "FLAPPYBIRD") {
                game = await GameService.updateGameFlappyBird(id, data);
            }
            return res.status(200).json({ data: game });
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
    
    @RoleGuard([ROLES.ADMIN, ROLES.BUSINESS, ROLES.CUSTOMER])
    async getGameByEventId(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const data = await GameService.getGameByEventId({id});
            return res.status(200).json({ data: data });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    @RoleGuard([ROLES.ADMIN, ROLES.BUSINESS, ROLES.CUSTOMER])
    async getGameTurnCustomer(req: Request, res: Response, next: NextFunction) {
        try {
            const _req = req as CustomUserRequest;
            if (!_req.body.customer_id) {
                req.body.customer_id = _req.user.uid;
            }
            const { id } = req.params;
            const { customer_id } = req.body
            const data = await GameService.getGameTurnCustomer({id, customer_id});
            return res.status(200).json({ data: data });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }
    async updateGameTurnCustomer(req: Request, res: Response, next: NextFunction) {
        try {
            const _req = req as CustomUserRequest;
            if (!_req.body.customer_id) {
                req.body.customer_id = _req.user.uid;
            }
            const { customer_id, gameID, turn } = req.body
            const data = await GameService.updateGameTurnCustomer({customer_id, gameID, turn});
            return res.status(200).json({ data: data });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    async updateScoreGameOfCustomer(req: Request, res: Response, next: NextFunction) {
        try {
            const { customer_id, gameID, score } = req.body
            const data = await GameService.updateScoreGameOfCustomer({customer_id, gameID, score});
            return res.status(200).json({ data: data });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    async requestGameTurn(req: Request, res: Response, next: NextFunction) {
        try {
            const _req = req as CustomUserRequest;
            const sender_id = _req.user.uid;
            const { receiver_email, game_id } = req.body;
            
            if (!receiver_email || !sender_id || !game_id) {
                return res.status(400).json({
                    ok: "false",
                    message: "Invalid data"
                });
            }
            
            const receiver = await UserService.findOneByEmail(receiver_email);
            if (!receiver) {
                return res.status(400).json({
                    ok: false,
                    message: "Request receiver not found"
                });
            }

            const game = await GameService.getById(game_id);
            if (!game) {
                return res.status(400).json({
                    ok: false,
                    message: "Game not found"
                });
            }

            const data = await GameService.addGameTurn(sender_id, receiver.id, game);
            
            return res.status(200).json({ 
                ok: true,
                message: "Send request success!",
                data: data 
            });
        } catch (error: any) {
            console.log(error);
            logger.error(error.message);
            next(error);
        }
    }

    async acceptGameTurn(req: Request, res: Response, next: NextFunction) {
        try {
            const _req = req as CustomUserRequest;
            const receiver_id = _req.user.uid;
            const { sender_id, request_turn_id } = req.body;
            
            if (!sender_id || !receiver_id || !request_turn_id) {
                return res.status(400).json({
                    ok: "false",
                    message: "Invalid data"
                });
            }
            const request_turn = await RequestTurn.findOne({
                where: { id: request_turn_id },
                relations: ["game"]
            });
            if (!request_turn || request_turn.status != TripleStatus.PENDING) {
                return res.status(400).json({
                    ok: false,
                    message: "Request not found or expired"
                });
            }

            const game_id = request_turn.game.id;
            console.log(sender_id, receiver_id);
            const receiver_game_turn = await GameTurns.findOne({ where: { game_id: game_id, customer_id: receiver_id } });
            const sender_game_turn = await GameTurns.findOne({ where: { game_id: game_id, customer_id: sender_id } });
            console.log(receiver_game_turn, sender_game_turn);

            if (receiver_game_turn && receiver_game_turn.quantity <= 0) {
                return res.status(400).json({
                    ok: false,
                    message: "No available turns"
                });
            }
            
            request_turn.status = TripleStatus.ACCEPTED;
            await request_turn.save();

            if (sender_game_turn) {
                sender_game_turn.quantity += 1;
                await sender_game_turn.save();
            }

            if (receiver_game_turn) {
                receiver_game_turn.quantity -= 1;
                await receiver_game_turn.save();
            }

            const data = { request_turn, receiver_game_turn };
            
            return res.status(200).json({ 
                ok: true,
                message: "Accept request success!",
                data: data 
            });

        } catch (error: any) {
            console.log(error);
            logger.error(error.message);
            next(error);
        }
    }

    async rejectGameTurn(req: Request, res: Response, next: NextFunction) {
        try {
            const _req = req as CustomUserRequest;
            const receiver_id = _req.user.uid;
            const { sender_id, request_turn_id } = req.body;
            
            if (!sender_id || !receiver_id || !request_turn_id) {
                return res.status(400).json({
                    ok: "false",
                    message: "Invalid data"
                });
            }

            const request_turn = await RequestTurn.findOne({where: {id: request_turn_id}});
            if (!request_turn) {
                return res.status(400).json({
                    ok: false,
                    message: "Request not found"
                });
            }

            request_turn.status = TripleStatus.REJECTED;
            await request_turn.save();

            const data = { request_turn };
            
            return res.status(200).json({ 
                ok: true,
                message: "Reject request success!",
                data: data 
            });

        } catch (error: any) {
            console.log(error);
            logger.error(error.message);
            next(error);
        }
    }
}

export default new GameController;