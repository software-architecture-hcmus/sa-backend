import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import azureStorageService from '../../shared/azure/azure-storage.service';

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

export const uploadSingle = (fieldName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        upload.single(fieldName)(req, res, async (err) => {
            if (err) {
                return next(err);
            }

            try {
                // If there's a file in the request, upload it to Azure
                if (req.file) {
                    const fileUrl = await azureStorageService.uploadFile(req.file);
                    req.body[fieldName] = fileUrl;
                }
                next();
            } catch (error) {
                next(error);
            }
        });
    };
};

// Optional: Add multiple files upload if needed
export const uploadMultiple = (fieldName: string, maxCount: number = 5) => {
    return (req: Request, res: Response, next: NextFunction) => {
        upload.array(fieldName, maxCount)(req, res, async (err) => {
            if (err) {
                return next(err);
            }

            try {
                const files = req.files as Express.Multer.File[];
                if (files && files.length > 0) {
                    const uploadPromises = files.map(file => 
                        azureStorageService.uploadFile(file)
                    );
                    const fileUrls = await Promise.all(uploadPromises);
                    req.body[fieldName] = fileUrls;
                }
                next();
            } catch (error) {
                next(error);
            }
        });
    };
}; 