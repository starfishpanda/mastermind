import express from 'express';
import randomNumberController from '../controllers/randomNumberController';
import userController from '../controllers/userController';
const apiRouter = express.Router();

// Fetch random numbers for game
apiRouter.get('/get-random-numbers', randomNumberController.getRandomNumbers);

// Login or create new user
apiRouter.post('/user-login', userController.upsertUser);

// Logout user
apiRouter.post('/user-logout', userController.logoutUser);

// Delete Account - add authentication check and delete controller
apiRouter.post('/delete-account', userController.isAuthenticated, userController.deleteAccount);
// Update Password - isAuthenticated, updatePassword

// Fetch Game Record stats - isAuthenticated, getGameRecord
apiRouter.get('/get-game-records', userController.isAuthenticated, userController.getGameRecords)




export default apiRouter;