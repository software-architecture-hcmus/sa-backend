import express from 'express';
const router = express.Router();


import gameController from "../modules/game/game.c";
import { uploadMultiple, uploadSingle } from "../lib/middlewares/upload.middleware";

router.get('/detail/:id', gameController.getById);
router.get('/default', gameController.getDefault);
router.get('/turn/:id', gameController.getGameTurnCustomer)
router.put('/turn', gameController.updateGameTurnCustomer)
router.put('/score', gameController.updateScoreGameOfCustomer)
router.get('/', gameController.getAll);
router.get('/event/:id', gameController.getGameByEventId);
router.post('/',uploadSingle('image'), gameController.createGame);
router.post('/request-game-turn', gameController.requestGameTurn);
router.post('/accept-game-turn', gameController.acceptGameTurn);
router.post('/reject-game-turn', gameController.rejectGameTurn);
router.put('/:id',uploadSingle('image'), gameController.updateGame);
router.post('/:id', gameController.saveResult);
router.post('/quiz/question', gameController.createQuestion)
router.put('/default', uploadSingle('image'), gameController.updateDefault);
router.patch('/quiz/question/:id', gameController.updateQuestion)
router.delete('/quiz/question/:id', gameController.updateQuestion)
export default router;