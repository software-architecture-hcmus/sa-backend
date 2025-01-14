import { NextFunction, Request, Response } from "express";
import { USER_FIREBASE_COLLECTION } from "../../shared/constants/user-firebase-collection.constant";
import CustomerVoucherService from "./customer-voucher.s"
import VoucherService from "./vouchers.s";
import { CustomUserRequest } from "../../lib/interfaces/request.interface";
import AppDataSource from "../../database/data-source";
import { TripleStatus } from "../../database/enums/triple-status.enum";
import { Transaction } from "../../database/entities/transactions.entity";
import { CustomerVoucher } from "../../database/entities/customer_vouchers.entity";
import { Voucher } from "../../database/entities/voucher.entity";
import logger from "../../utils/logger";
import { RoomPlayerRequest } from "../../lib/interfaces/player.interface";
import { ROLES } from "../../shared/constants/user-roles.constant";
import { RoleGuard } from "../../lib/decorators/role-guard.decorator";

class VoucherController {

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const _req = req as CustomUserRequest;
            const vouchers = await VoucherService.getAll({
                brand_id: _req.user.uid
            });
            return res.status(200).json({ data: vouchers });
        } catch (error) {
            next(error);
        }
    }

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
            await entityManager.update(Transaction, { customer_voucher: {id: customerVoucher.id}, status: TripleStatus.PENDING }, { status: TripleStatus.EXPIRED });
            await entityManager.save(transactionEntity);
            
            return res.status(200).json({
                ok: true,
                message: "Receive give away voucher success",
            });
        });
    }

    async getCustomerVouchers(req: Request, res: Response, next: NextFunction) {
        try {
            const _req = req as CustomUserRequest;
            const customerVouchers = await VoucherService.getCustomerVouchers({
                brand_id: _req.user.uid
            });
            return res.status(200).json({ data: customerVouchers });
        } catch (error) {
            next(error);
        }
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

    

    async useCustomerVoucher(req: Request, res: Response, next: NextFunction) {
        const _req = req as CustomUserRequest;
        const customer_id = _req.user.uid;
        const customer_voucher_id = _req.body.customer_voucher_id;
        
        if (!customer_voucher_id || !customer_id) {
            return res.status(400).json({
                ok: false,
                message: "Invalid data",
            });
        }

        try {
            const customerVoucher = await AppDataSource.getRepository(CustomerVoucher).findOne({
                where: { id: customer_voucher_id, customer_id: customer_id },
                relations: ['voucher'],
            });

            if (!customerVoucher) {
                return res.status(404).json({
                    ok: false,
                    message: "Customer voucher not found",
                });
            }

            if (customerVoucher.code) {
                return res.status(400).json({
                    ok: false,
                    message: "Voucher is used",
                });
            }

            const rs = await CustomerVoucherService.useVoucher(customer_voucher_id, customerVoucher.voucher.id);

            if (rs.ok) {
                return res.status(200).json(rs);
            }
            else {
                return res.status(400).json(rs);
            }
        } catch (error) {
            console.log(error);
            next(error);
        }

    }
    async createVoucherForQuizGame(req: Request, res: Response, next: NextFunction)
    {
        const {customer_id, game_room_id, score, position }= req.body;
        if (!customer_id || !game_room_id ) {
            return res.status(400).json({
                ok: false,
                message: "Invalid data",
            });
        }
        try {
            const roomPlayer: RoomPlayerRequest ={
                customer_id: customer_id,
                game_room_id: game_room_id,
                score: Number(score) && Number(score)  > 0 ? Number(score): 0 ,
                position: Number(position)
            }
            const rs = await VoucherService.createVoucherForQuizGame(roomPlayer);
            console.log("voucher: ", rs);
            return res.status(201).json({ data: rs });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }

    }
    async createVoucherForFlappyBird(req: Request, res: Response, next: NextFunction)
    {
        const {customer_id, gameID, score }= req.body;
        if (!customer_id || !gameID ) {
            return res.status(400).json({
                ok: false,
                message: "Invalid data",
            });
        }
        try {
            const rs = await VoucherService.createVoucherForFlappyBird({customer_id, gameID, score});
            console.log("voucher: ", rs);
            return res.status(201).json({ data: rs });
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }
}

export default new VoucherController;