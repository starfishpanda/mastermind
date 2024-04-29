import UserModel from '../models/UserModel';
import { Request, Response, NextFunction } from 'express';
import argon2 from 'argon2';
import UserSession from '../types/UserSession'


const userController = {
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
};

export default userController;