import { NextFunction, Request, Response } from "express";
import logger from "../../utils/logger";
import { ROLES } from "../../shared/constants/roles.constant";
import { RoleGuard } from "../../lib/decorators/role-guard.decorator";
import AppDataSource from "../../database/data-source";
import { CustomUserRequest } from "../../lib/interfaces/request.interface";
import EventsService from "./events.s";


class EventsController {

    @RoleGuard([ROLES.ADMIN, ROLES.BUSINESS])
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const _req = req as CustomUserRequest;
            if(!_req.body.brand_id) {
                req.body.brand_id = _req.user.uid;
            }

            const event = await EventsService.create(req.body);
            return res.status(200).json({ message: 'Event created successfully', data: event });
            
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    @RoleGuard([ROLES.ADMIN, ROLES.BUSINESS])
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const _req = req as CustomUserRequest;
            const params: any = {};
            if(_req.user.role === ROLES.BUSINESS) {
                params.brand_id = _req.user.uid;
            }

            const events = await EventsService.getAll(params);
            return res.status(200).json({ data: events });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const event = await EventsService.getById(req.params.id);
            console.log(event, req.params.id)
            return res.status(200).json({ data: event });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }
}

export default new EventsController;