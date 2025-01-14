import { NextFunction, Request, Response } from "express";
import { USER_FIREBASE_COLLECTION } from "../../shared/constants/user-firebase-collection.constant";
import { firebaseAuth, firebaseFirestore } from "../../utils/firebase";
import { Transaction } from "../../database/entities/transactions.entity";
import { Voucher } from "../../database/entities/voucher.entity";
import { CustomUserRequest } from "../../lib/interfaces/request.interface";
import { RequestTurn } from "../../database/entities/request_turns.entity";

class HistoryController {
    async getTransaction(req: Request, res: Response, next: NextFunction) {
        try {
            const _req = req as CustomUserRequest;
            const transactions = await Transaction.find({
                where: [
                    { sender_id: _req.user.uid },
                    { receiver_id: _req.user.uid }
                ]
            });
            const userDictionary = {};
            const userSnapshot = await firebaseFirestore.collection(USER_FIREBASE_COLLECTION).get();
            userSnapshot.docs.map(doc => 
                userDictionary[doc.id] = doc.data().name,
            );
            const rs = transactions.map(t => ({
                ...t,
                sender_name: userDictionary[t.sender_id],
                receiver_name: userDictionary[t.receiver_id],
            }))
            res.json(rs);
        }
        catch (e) {
            console.log(e);
            next(e);
        }
    }

    async getRequestTurn(req: Request, res: Response, next: NextFunction) {
        try {
            const _req = req as CustomUserRequest;
            const requestTurns = await RequestTurn.find({
                where: [
                    { sender_id: _req.user.uid },
                    { receiver_id: _req.user.uid }
                ]
            });
            const userDictionary = {};
            const userSnapshot = await firebaseFirestore.collection(USER_FIREBASE_COLLECTION).get();
            userSnapshot.docs.map(doc => 
                userDictionary[doc.id] = doc.data().name,
            );
            const rs = requestTurns.map(t => ({
                ...t,
                sender_name: userDictionary[t.sender_id],
                receiver_name: userDictionary[t.receiver_id],
            }))
            res.json(rs);
        }
        catch (e) {
            console.log(e);
            next(e);
        }
    }
}

export default new HistoryController;