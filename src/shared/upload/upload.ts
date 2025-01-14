import { NextFunction, Request, Response } from "express";
import logger from "../../utils/logger";

class UploadController {
    async upload(req: Request, res: Response, next: NextFunction) {
        try {
            const { files } = req.body;
            return res.status(200).json({ data: files });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }
}

export default new UploadController();