import express from 'express';
const router = express.Router();

import authController from '../modules/auth/auth.c';
import { validator } from '../shared/middlewares/validator';
import { fetchLoginSchema } from '../modules/auth/schema/login.schema';
router.post('/login', validator(
    {
        body: fetchLoginSchema
    }
), authController.login);

export default router;