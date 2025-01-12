import { NextFunction, Request, Response } from "express";
import logger from "../../utils/logger";
import { ROLES } from "../../shared/constants/user-roles.constant";
import { RoleGuard } from "../../lib/decorators/role-guard.decorator";
import AppDataSource from "../../database/data-source";
import { BusinessService } from "./business.s";

class BusinessController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            return res.status(200).json({ message: 'Business created successfully', data: {} });
        } catch (error: any) {
            next(error);
        }
    }

    @RoleGuard([ROLES.BUSINESS])
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            return res.status(200).json({
                data: [{
                    name: 'Business 1',
                    address: 'Address 1',
                },
                {
                    name: 'Business 2',
                    address: 'Address 2',
                }]
            });
        } catch (error: any) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            return res.status(200).json({ data: {} });
        } catch (error: any) {
            next(error);
        }
    }
}
export default new BusinessController;