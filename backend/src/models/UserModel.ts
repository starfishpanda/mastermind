import { Schema, model, Document, Types } from 'mongoose'
import { IUser } from '../types/user.types.js'

/**
 * Interface representing a User.
 * 
 * @interface IUser
 * @property {string} _id - Unique identifier for the user.
 * @property {string} name - Name of the user.
 * @property {string} email - Email address of the user.
 * @property {string} password - Password of the user.
 * @property {Boolean} isVerified - Indicates if the user's email is verified.
 * @property {string} [resetPasswordToken] - Token used for resetting the password (optional).
 * @property {Date} [resetPasswordExpires] - Expiry date for the reset password token (optional).
 * @property {string} [verificationToken] - Token used for email verification (optional).
 * @property {Date} [verificationTokenExpires] - Expiry date for the verification token (optional).
 * @property {Date} createdAt - Date when the user was created.
 * @property {Date} updatedAt - Date when the user was last updated.
 */

const UserSchema = new Schema<IUser>(
  {
  username: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
  
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  favoriteNumber: { type: Number, default: null },
  },
  {
    timestamps: true
  }
);

const UserModel = model<IUser>('User', UserSchema)

export default UserModel
