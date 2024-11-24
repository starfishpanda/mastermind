import express from 'express';
import randomNumberController from '../controllers/randomNumberController';
import userController from '../controllers/userController';
import leaderboardController from '../controllers/leaderboardController';
const apiRouter = express.Router();

// Fetch random numbers for game
apiRouter.get('/get-random-numbers', randomNumberController.getRandomNumbers);

// Login or create new user
apiRouter.post('/user-login', userController.upsertUser);

// Logout user
apiRouter.post('/user-logout', userController.isAuthenticated, userController.logoutUser);

// Delete Account - add authentication check and delete controller
apiRouter.delete('/delete-account', userController.isAuthenticated, userController.deleteAccount);
// Update Password - isAuthenticated, updatePassword

// Fetch Game Record stats - isAuthenticated, getGameRecord
apiRouter.get('/get-game-records', userController.isAuthenticated, userController.getGameRecords);

// Fetch the emails and win loss ratio of the top 10 users 
apiRouter.get('/get-leaderboard', leaderboardController.getUserStats);




export default apiRouter;