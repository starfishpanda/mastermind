import express from 'express';
import randomNumberController from '../controllers/randomNumberController';

const apiRouter = express.Router();

apiRouter.get('/get-random-numbers', randomNumberController.getRandomNumbers);

export default apiRouter;