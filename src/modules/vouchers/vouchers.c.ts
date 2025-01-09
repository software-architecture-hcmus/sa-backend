import { NextFunction, Request, Response } from "express";
import { USER_FIREBASE_COLLECTION } from "../../shared/constants/user-firebase-collection.constant";
import CustomerVoucherService from "./customer-voucher.s"
import { CustomUserRequest } from "../../lib/interfaces/request.interface";

class VoucherController {
    async test(req: Request, res: Response, next: NextFunction) {
        try {
            return res.status(200).json({
                message: "Test successful"
            });
        } catch (error) {
            next(error);
        }
    }

    async giveAway(req: Request, res: Response, next: NextFunction) {
        const _req = req as CustomUserRequest;
        const body = _req.body;
        const {customer_voucher_id, sender_id, receiver_email} = body;
        if (!customer_voucher_id || !sender_id || !receiver_email) {
            return res.status(400).json({
                ok: false,
                message: "invalid data",
            });
        }
        try {
            const rs = await CustomerVoucherService.giveAway(customer_voucher_id, sender_id, receiver_email);
            if (rs.ok) {
                res.status(200).json(rs);
            }
            else {
                res.status(400).json(rs);
            }
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }

    async acceptVoucher(req: Request, res:Response, next: NextFunction) {
        const _req = req as CustomUserRequest;
        const params = _req.params;
        console.log(params);

        return res.send("OKE");
    }
}

export default new VoucherController;