import { NextFunction, Request, Response } from "express";
import logger from "../../utils/logger";
import NotificationsService from "./notification.s";


class NotificationsController {
    
    async getByAccountId(req: Request, res: Response, next: NextFunction) {
        try {
            const notifications = await NotificationsService.getByAccountId(req.params.id);
            return res.status(200).json({ data: notifications, message: 'Notifications fetched successfully' });

        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }
}

export default new NotificationsController;