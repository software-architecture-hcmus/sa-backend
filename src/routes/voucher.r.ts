import express from "express";
import VoucherController from "../modules/vouchers/vouchers.c";

const router = express.Router();
router.get("/test", VoucherController.test)
router.post("/give-away", VoucherController.giveAway);
router.get("/accept-voucher", VoucherController.acceptVoucher);
router.get("/customer-voucher", VoucherController.getCustomerVoucher);

export default router;