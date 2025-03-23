import { IUser } from '../types/user.types.js'
import UserModel from '../models/UserModel.js'
import { Request, Response, NextFunction } from 'express'
import { IUserInput } from '../types/user.types.js'
import { EmailService } from '../services/email.service.js'
import { isValidEmail } from '../utils/isValidEmail.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'
import crypto from 'crypto'

// Create new user
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password }: IUserInput = req.body

    // Check that email and password are correct format
    if (!username || !email || !password || !isValidEmail(email)) {
      console.error('Invalid credentials')
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Check if the email already exists
    const existingUser: IUser | null = await UserModel.findOne({
      $or: [
        { username: username },
        { email: email.toLowerCase() }
      ]
    })

    if (existingUser) {
      if (existingUser.username === username){
        return res.status(409).json( { message: "Username already taken."})
      } else {
        return res.status(409).json({ message: 'Email already registered.' })

      }
    }

    // Verify SMTP connection
    const isEmailServiceWorking = await EmailService.verifyConnection();
    if (!isEmailServiceWorking) {
    return res.status(500).json({message: 'Email service is not available. Please try again later.'});
    }
    // Generate verification token and hash password
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const hashPassword = await bcrypt.hash(password, config.bcrypt.saltRounds)
    let user: IUser | null = await UserModel.create({
      username,
      email,
      password: hashPassword,
      verificationToken,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    try {
      // Send verification email
      await EmailService.sendVerificationEmail(email, username, verificationToken);

      res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.'});
      } catch (error) {
      // If email fails, mark user as requiring email verification retry
      console.error('Failed to send verification email');

      await UserModel.findByIdAndUpdate(user._id, {
        $set: {
        emailVerificationFailed: true
        }
      });

      res.status(201).json({ message: 'Account created but verification email could not be sent. Please contact support.',
        userId: user._id
      });
      }
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      });
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { email, password } = req.body;

    const user: IUser | null = await UserModel.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials"} )
    }

    if (user.isVerified != true) {
      return res.status(401).json({ message: 'Verify Email.'})
    }

    const validPassword = await bcrypt.compare(password,user.password)

    if (!validPassword){
      return res.status(401).json({ message: "Invalid credentials"} )
    }

    const payload = { 
      userId: user._id, 
      username: user.username, 
      email: user.email 
    };
    const secret = config.jwt.secret as jwt.Secret;
    const options = { 
      expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'] 
    };

    const token = jwt.sign(payload, secret, options);

    res.status(200).json({
      message: 'Successfully logged in.',
      data: {
        token,
        user: {
          userId: user._id,
          username: user.username,
          email: user.email
        }
      },
    })

  } catch (error){
    console.error('Error logging in.', error)
    res.status(500).json({ message: 'Internal Server Error.' })
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    const user = await UserModel.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired verification token" });
      return;
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({
      status: "success",
      message: "Email verified successfully! Redirecting to login...",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
    res.status(404).json({message: 'No account found with that email'});
    return;
    }

    // Verify email service before proceeding
    const isEmailServiceWorking = await EmailService.verifyConnection();
    if (!isEmailServiceWorking) {
    res.status(500).json({ message: 'Email service is not available. Please try again later.'});
    return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    try {
    // Send password reset email
    await EmailService.sendPasswordResetEmail(email, user.username, resetToken);

    res.json({ message: 'Password reset instructions sent to your email'});
    } catch (emailError) {
    console.error('Failed to send password reset email:', emailError);

    // Reset the token since email failed
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(500).json({ message: 'Failed to send password reset email. Please try again later.'});
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error'});
  }
};

// Reset password method
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user by reset token
    const user = await UserModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
    res.status(400).json({message: "Invalid or expired reset token"});
    return;
    }

    // Hash new password and save
    const hashedPassword = await bcrypt.hash(
    password,
    config.bcrypt.saltRounds
    );
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully"});
  } catch (error) {
    res.status(500).json({ message: "Internal server error"});
  }
};