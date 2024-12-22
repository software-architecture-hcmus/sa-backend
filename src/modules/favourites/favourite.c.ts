import { NextFunction, Request, Response } from "express";
import logger from "../../utils/logger";
import FavouritesService from "./favourite.s";


class FavouritesController {
    
    async getByCustomerId(req: Request, res: Response, next: NextFunction) {
        try {
            const favourite = await FavouritesService.getByCustomerId(req.params.id);
            return res.status(200).json({ data: favourite, message: 'Favourites fetched successfully' });

        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }
}

export default new FavouritesController;