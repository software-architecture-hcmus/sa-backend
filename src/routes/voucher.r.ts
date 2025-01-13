import express from "express";
import VoucherController from "../modules/vouchers/vouchers.c";

const router = express.Router();
router.get("/", VoucherController.getAll);
router.get("/test", VoucherController.test)
router.post("/give-away", VoucherController.giveAway);
router.get("/accept-voucher", VoucherController.acceptVoucher);
router.get("/customer-voucher", VoucherController.getCustomerVoucher);
router.post("/use-customer-voucher", VoucherController.useCustomerVoucher);
router.post("/quiz", VoucherController.createVoucherForQuizGame);
router.post("/flappy-bird",VoucherController.createVoucherForFlappyBird)

export default router;