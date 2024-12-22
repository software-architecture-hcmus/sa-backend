import express from 'express';
const router = express.Router();


import notificationsController from '../modules/notifications/notification.c';

router.get('/account/:id', notificationsController.getByAccountId);

// 2 cai duoi co the ko can :))
// router.patch('/:id', eventsController.update);
// router.delete('/:id', usersController.deleteUser);

export default router;