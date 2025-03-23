export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  isVerified: Boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  wins: number
  losses: number
  favoriteNumber: number
}

export interface IUserInput {
  username: string;
  email: string;
  password: string;
}
