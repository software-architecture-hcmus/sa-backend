import { NextFunction, Request, Response } from "express";
import { USER_FIREBASE_COLLECTION } from "../../shared/constants/user-firebase-collection.constant";
import CustomerVoucherService from "./customer-voucher.s"
import { CustomUserRequest } from "../../lib/interfaces/request.interface";
import AppDataSource from "../../database/data-source";
import { TripleStatus } from "../../database/enums/triple-status.enum";
import { Transaction } from "../../database/entities/transactions.entity";
import { CustomerVoucher } from "../../database/entities/customer_vouchers.entity";
import { Voucher } from "../../database/entities/voucher.entity";

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
        const sender_id = _req.user.uid;
        const {customer_voucher_id, receiver_email} = body;
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
        const userID = _req.user?.uid;
        const {ga_token} = _req.query as {ga_token: string};
        if (!userID || !ga_token) {
            return res.status(400).json({
                ok: false,
                message: "Invalid data",
            });
        }

        await AppDataSource.transaction(async (entityManager) => {

            //Get the transaction by token
            const transactionEntity = await entityManager.findOne(Transaction, { where: { token: ga_token }, relations: ['customer_voucher'] });
            if (!transactionEntity) {
                return res.status(404).json({
                    ok: false,
                    message: "Transaction not found",
                });
            }

            //check receiver id & status
            if (transactionEntity.receiver_id !== userID) {
                return res.status(400).json({
                    ok: false,
                    message: "Receiver ID does not match",
                });
            }
            if (transactionEntity.status !== TripleStatus.PENDING) {
                return res.status(400).json({
                    ok: false,
                    message: "Transaction status is not pending",
                });
            }

            //The GA email will expire after 3 days, so check
            const createdAt = new Date(transactionEntity.createdAt);
            const currentDate = new Date();
            if ((currentDate.getTime() - createdAt.getTime()) / (1000 * 3600 * 24) > 3) {
                return res.status(400).json({
                    ok: false,
                    message: "Transaction has expired",
                });
            }

            const customerVoucher = transactionEntity.customer_voucher;
            if (!customerVoucher || customerVoucher.code) {
                return res.status(400).json({
                    ok: false,
                    message: "Customer voucher not found or voucher was claimed",
                });
            }

            //If everything ok, begin transaction
            customerVoucher.customer_id = userID;
            transactionEntity.status = TripleStatus.ACCEPTED;
            transactionEntity.transaction_time = currentDate;

            await entityManager.save(customerVoucher);
            await entityManager.update(Transaction, { customer_voucher: {id: customerVoucher.id} }, { status: TripleStatus.EXPIRED });
            await entityManager.save(transactionEntity);
            
            return res.status(200).json({
                ok: true,
                message: "Receive give away voucher success",
            });
        });
    }

    
    async getCustomerVoucher(req: Request, res: Response, next: NextFunction) {
        const _req = req as CustomUserRequest;
        try {
            const customerVouchers = await AppDataSource.getRepository(CustomerVoucher).find({
                where: { customer_id: _req.user?.uid },
                relations: ['voucher'],
                select: {
                    id: true,
                    customer_id: true,
                    code: true,
                    voucher: {
                        id: true,
                        image: true,
                        value: true,
                        description: true,
                        expiry_date: true,
                        status: true,
                    }
                }
            });

            return res.status(200).json({
                ok: true,
                data: customerVouchers,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new VoucherController;