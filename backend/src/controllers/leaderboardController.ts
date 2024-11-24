import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/UserModel';

const leaderboardController = {

  getUserStats: async (req: Request, res: Response, next: NextFunction ) => {
    try {
      const userId = req.params.id;
      const gameStats = await UserModel.findOne({_id: userId}, 'wins losses');

      if (!gameStats){
        return res.status(404).json({ message: 'User not found'})
      };

      res.status(200).json({wins: gameStats.wins, losses: gameStats.losses });
    } catch (error){
      next(error);
    }
  },
};

export default leaderboardController;