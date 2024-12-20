import UserModel from '../models/UserModel.js';
import { Request, Response, NextFunction } from 'express';
import argon2 from 'argon2';
import UserSession from '../types/UserSession.js'


const userController = {
  // Create new user or log into current user
  upsertUser: async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
        console.error('userController.upsertUser: Missing email or password');
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        let user = await UserModel.findOne({ email });

        // If the user doesn't exist, create a new one
        if (!user) {
            const hashedPassword = await argon2.hash(password);
            user = await UserModel.create({ email, password: hashedPassword });
            console.log('New user created.');
            (req.session as UserSession).userId = user._id.toString(); // Set user ID in session
            return res.status(201).json({ message: 'User successfully created.'});
        } else {
            // If the user exists, verify the password
            if (!(await argon2.verify(user.password, password))) {
                console.error('userController.upsertUser: Incorrect password');
                return res.status(401).json({ message: 'Login unsuccessful, incorrect password.' });
            }
            console.log('User logged in.');
            (req.session as UserSession).userId = user._id.toString(); // Set user ID in session
            return res.status(200).json({ message: 'Login successful.'});
        }
    } catch (error) {
        console.error(`userController.upsertUser: Error handling user login or creation: ${error}`);
        return next(error);
    }

  },

  logoutUser: async (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy((error) => {
      if (error){
        console.error("There was an error logging out", error)
        res.status(500).json({ message: "Unable to logout" });
      }
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: "Logout Successful"})
    })
  },

  isAuthenticated: async (req: Request, res: Response, next: NextFunction) => {
    if ((req.session as UserSession).userId){
      return next();
    } else{
      res.status(401).json( { message: "User is not authenticated"});
    }
  },

  deleteAccount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check for the account to delete through sessions ID
      const userId = (req.session as UserSession).userId;
      if (!userId){
        console.error("userController.deleteAccount: There is no userId")
        res.status(404).json({ message: "User not found"})
      }
      const deletedUser = await UserModel.findByIdAndDelete(userId);
      
      if (!deletedUser){
        console.error("userController.deleteAccount: No user found with that ID")
        res.status(404).json({ message: "No user found with that ID"})
      } else{
        // Destroy the session and delete associated cookie after deleting account
        req.session.destroy((error) => {
          if (error){
            console.error("userController.deleteAccount: There was an error destroying the account session", error)
            res.status(500).json({ message: "Unable to destroy session" });
          }
          res.clearCookie('connect.sid');
          return res.status(200).json({ message: "User account successfully deleted"})
        })
      }
    } catch(error){
      console.error("userController.deleteAccount: There was an error deleting the account");
      return next(error);
    }
    
  },

  updatePassword: async (req: Request, res: Response, next: NextFunction) => {

  },

  getGameRecords: async (req: Request, res: Response, next: NextFunction) => {
    interface GameRecord {
      wins: number;
      losses: number;
      favoriteNumber: number;
    }
  
    try{
      const userId = (req.session as UserSession).userId
      // Check if the user has a session in place
      if (!userId){
        console.error("userController.getGameRecords: There is no userId")
        return res.status(404).json({ message: "User not found"})
      }

      const gameRecords = await UserModel.findById(userId).select('wins losses favoriteNumber') as GameRecord;
      if (!gameRecords){
        console.error('userController.getGameRecords: No user found with this ID')
        return res.status(404).json({ message: "No user found with that ID"})
      }
      const { wins, losses, favoriteNumber } = gameRecords;
      return res.status(200).json({ wins, losses, favoriteNumber})

    } catch(error){
      console.error('userController.getGameRecords: An error occurred getting Game Records')
      return next(error);
    }
  },
};

export default userController;