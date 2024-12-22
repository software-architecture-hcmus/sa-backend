import express from 'express';
const router = express.Router();


import favouritesController from '../modules/favourites/favourite.c';

router.get('/customer/:id', favouritesController.getByCustomerId);

// 2 cai duoi co the ko can :))
// router.patch('/:id', eventsController.update);
// router.delete('/:id', usersController.deleteUser);

export default router;