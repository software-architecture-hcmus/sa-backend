import express from 'express';
const router = express.Router();


import eventsController from '../modules/events/events.c';

router.get('/', eventsController.getAll);
router.get('/:id', eventsController.getById);
router.post('/', eventsController.create);

// 2 cai duoi co the ko can :))
// router.patch('/:id', eventsController.update);
// router.delete('/:id', usersController.deleteUser);

export default router;