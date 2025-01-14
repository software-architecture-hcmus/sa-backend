import { Router } from "express"
import historyC from "../modules/history/history.c";

const router = Router();

router.get("/ga-voucher", historyC.getTransaction)
router.get("/ga-request-turn", historyC.getRequestTurn)

export default router;