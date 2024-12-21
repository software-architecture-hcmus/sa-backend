import express from 'express';
const router = express.Router();


import gameController from "../modules/game/game.c";
router.get('/', gameController.getById);
router.post('/', gameController.createGame);
router.post('/:id', gameController.saveResult);
router.post('/quiz/question', gameController.createQuestion)
router.patch('/quiz/question/:id', gameController.updateQuestion)
router.delete('/quiz/question/:id', gameController.updateQuestion)
export default router;