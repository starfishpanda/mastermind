import express from 'express';
import randomNumberController from '../controllers/randomNumberController';
import userController from '../controllers/userController';
const apiRouter = express.Router();

// Fetch random numbers for game
apiRouter.get('/get-random-numbers', randomNumberController.getRandomNumbers);

// Login or create new user
apiRouter.post('/user-login', userController.upsertUser);


export default apiRouter;