import express from 'express'
import {authenticateToken} from '../middleware/auth.js'
import { validateRequest } from '../middleware/validate.js';
import { signupSchema, loginSchema, resetPasswordSchema, forgotPasswordSchema } from '../validators/user.validators.js';
import { signup, login, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController.js'
const authRouter = express.Router()

authRouter.post('/signup', validateRequest(signupSchema), signup)
authRouter.post('/login', validateRequest(loginSchema), login)
authRouter.get('/verify-email/:token', verifyEmail);
authRouter.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword);
authRouter.post('/reset-password/:token', validateRequest(resetPasswordSchema), resetPassword);

export default authRouter