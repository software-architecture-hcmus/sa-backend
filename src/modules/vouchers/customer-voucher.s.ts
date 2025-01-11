import { DatabaseService } from "../../database/database.service";
import  {CustomerVoucher} from "../../database/entities/customer_vouchers.entity"
import { Transaction } from "../../database/entities/transactions.entity";

import UserService from "../users/users.s";
import { TripleStatus } from "../../database/enums/triple-status.enum";
import { sendEmail } from "../../utils/nodeMailer";
import { config } from "../../config/configuration";
import { VoucherCode } from "../../database/entities/voucher_codes.entity";
import AppDataSource from "../../database/data-source";
import { Voucher } from "../../database/entities/voucher.entity";

class CustomerVoucherService {
    private readonly customerVoucherRepository = DatabaseService.getInstance().getRepository(CustomerVoucher);
    private readonly transactionRepository = DatabaseService.getInstance().getRepository(Transaction)

    async giveAway(customer_voucher_id: string, sender_id: string, receiver_email: string) {
        const receiver = await UserService.findOneByEmail(receiver_email);
        if (!receiver) {
            return {
                ok: false,
                message: "Cannot find receiver account"
            }
        }
        
        const sender = await UserService.findOne(sender_id) as { id: string; name?: string; [key: string]: any };
        if (!sender) {
            return {
                ok: false,
                message: "Cannot find sender account",
            }
        }

        const customer_voucher = await this.customerVoucherRepository.findOne({ where: { id: customer_voucher_id } }) ?? undefined;
        if (!customer_voucher || customer_voucher.code) {
            return {
                ok: false,
                message: "Cannot find voucher or voucher was claimed",
            }
        }

        const token = crypto.randomUUID();

        const subject = "You have a GiveAway Voucher"
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333;">You Have Received a Voucher!</h2>
                <p style="color: #666;">${sender.name} has sent you a voucher through our platform.</p>
                <p style="color: #666;">To accept this voucher, please click the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${config.FRONTEND_CUSTOMER_URL}/receive-give-away?ga_token=${token}" 
                       style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">
                        Accept Voucher
                    </a>
                </div>
                <p style="color: #999; font-size: 12px;">If you did not expect to receive this voucher, you can safely ignore this email.</p>
            </div>
        `
        
        try {
            await sendEmail(receiver_email, subject, html)
        }
        catch(e) {
            return {
                ok: false,
                message: "Cannot send email"
            }
        }

        const receiver_id = receiver.id;
        const status = TripleStatus.PENDING;
        
        const transaction = this.transactionRepository.create({
            sender_id: sender_id,
            receiver_id: receiver_id,
            token: token,
            status: status,
            customer_voucher: customer_voucher,
        });

        await this.transactionRepository.save(transaction);
        return {
            ok: true,
            message: "SUCCESS",
        }
    }
    
    async useVoucher(customer_voucher_id: string, voucher_id: string) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const voucherCode = await queryRunner.manager.findOne(VoucherCode, {
                where: { voucher: { id: voucher_id }, isClaimed: false }
            });

            if (!voucherCode) {
                await queryRunner.rollbackTransaction();
                return {
                    ok: false,
                    message: "Voucher are out of stock"
                };
            }

            voucherCode.isClaimed = true;
            await queryRunner.manager.save(voucherCode);

            const customerVoucher = await this.customerVoucherRepository.findOne({ where: { id: customer_voucher_id } });
            if (!customerVoucher) {
                await queryRunner.rollbackTransaction();
                return {
                    ok: false,
                    message: "Customer voucher not found"
                };
            }

            customerVoucher.code = voucherCode.code;
            await queryRunner.manager.save(customerVoucher);

            const transactions = await this.transactionRepository.find({ where: { customer_voucher: {id: customer_voucher_id}, status: TripleStatus.PENDING } });
            for (const transaction of transactions) {
                transaction.status = TripleStatus.REJECTED;
                transaction.transaction_time = new Date();
                await queryRunner.manager.save(transaction);
            }

            await queryRunner.commitTransaction();
            return {
                ok: true,
                data: {
                    voucher: customerVoucher,
                },
                message: "Voucher used successfully"
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return {
                ok: false,
                message: "Error using voucher"
            };
        } finally {
            await queryRunner.release();
        }
    }
}

export default new CustomerVoucherService;