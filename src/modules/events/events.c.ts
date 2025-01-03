import { NextFunction, Request, Response } from "express";
import logger from "../../utils/logger";
import { ROLES } from "../../shared/constants/roles.constant";
import { RoleGuard } from "../../lib/decorators/role-guard.decorator";
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
            req.body.vouchers = JSON.parse(req.body.vouchers);

            const event = await EventsService.create(req.body);
            return res.status(200).json({ ok: true, message: 'Event created successfully', data: event });
            
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
            return res.status(200).json({ data: event });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    @RoleGuard([ROLES.ADMIN, ROLES.BUSINESS])
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const _req = req as CustomUserRequest;
            const eventId = req.params.id;

            // If user is BUSINESS, verify they own the event
            if (_req.user.role === ROLES.BUSINESS) {
                const event = await EventsService.getById(eventId);
                if (event?.brand_id !== _req.user.uid) {
                    return res.status(403).json({ 
                        ok: false, 
                        message: 'You are not authorized to delete this event' 
                    });
                }
            }

            await EventsService.softDelete(eventId);
            return res.status(200).json({ 
                ok: true, 
                message: 'Event deleted successfully' 
            });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    @RoleGuard([ROLES.ADMIN, ROLES.BUSINESS])
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const _req = req as CustomUserRequest;
            const { id } = req.params;
            const updateData = req.body;
            
            // If user is BUSINESS, verify they own the event
            if (_req.user.role === ROLES.BUSINESS) {
                const event = await EventsService.getById(id);
                if (event?.brand_id !== _req.user.uid) {
                    return res.status(403).json({ 
                        ok: false, 
                        message: 'You are not authorized to update this event' 
                    });
                }
            }

            req.body.vouchers = JSON.parse(req.body.vouchers);
            const updatedEvent = await EventsService.update(id, updateData);
            
            if (!updatedEvent) {
                return res.status(404).json({ 
                    ok: false, 
                    message: 'Event not found' 
                });
            }

            return res.status(200).json({ 
                ok: true, 
                message: 'Event updated successfully',
                data: updatedEvent 
            });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }
}

export default new EventsController;