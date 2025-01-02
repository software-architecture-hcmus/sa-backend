import express from 'express';
const router = express.Router();

import BusinessController from '../modules/business/business.c';

router.get('/', BusinessController.getAll);

export default router;