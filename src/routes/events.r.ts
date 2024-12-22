import express from 'express';
const router = express.Router();


import eventsController from '../modules/events/events.c';
import { uploadSingle } from '../lib/middlewares/upload.middleware';

router.get('/', eventsController.getAll);
router.post('/', uploadSingle('image'), eventsController.create);
router.get('/:id', eventsController.getById);
router.delete('/delete/:id', eventsController.delete);
router.put('/update/:id', uploadSingle('image'), eventsController.update);
router.post('/', eventsController.create);
router.post('/subscribe', eventsController.subscribe);
router.post('/unsubscribe', eventsController.unsubscribe);

// 2 cai duoi co the ko can :))
// router.patch('/:id', eventsController.update);
// router.delete('/:id', usersController.deleteUser);

export default router;