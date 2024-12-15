import { Request, Response, NextFunction } from "express";
import { firebaseAuth } from "../../utils/firebase";
import { UnauthorizedException } from "../exceptions/unauthorized.exception";
import { CustomUserRequest, PayloadUser } from "../interfaces/request.interface";
import { firebaseFirestore } from "../../utils/firebase";
import { STATUS } from "../../shared/constants/status.constant";
import { USER_FIREBASE_COLLECTION } from "../../shared/constants/user-firebase-collection.constant";

const authenticationMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
   
    const _req = req as CustomUserRequest;
    const authorization: string | undefined = req.header('Authorization');
    const token = authorization?.split(' ')[1];

    if (!token) {
        return next(new UnauthorizedException({ details: [{ issue: 'Unauthorized' }] }));
    }

    try {
        const user = await firebaseAuth.verifyIdToken(token);
        const userDoc = await firebaseFirestore.collection(USER_FIREBASE_COLLECTION).doc(user.uid).get();
        const userData = {
            ...userDoc.data()
        } as PayloadUser;

        if(userData.status === STATUS.BANNED) {
            return next(new UnauthorizedException({ details: [{ issue: 'User is banned' }] }));
        }

        _req.user = userData;
        return next();
        
    } catch (error) {
        return next(new UnauthorizedException({ details: [{ issue: 'Expired or invalid token' }] }));
    }
}

export default authenticationMiddleware;

