import { Schema, model, Document, Types } from 'mongoose'

export interface IUser extends Document {
  _id: Types.ObjectId
  email: string
  password: string
  wins: number
  losses: number
  favoriteNumber: number
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    favoriteNumber: { type: Number, default: null },
  },
  { timestamps: true }
)

const UserModel = model<IUser>('User', UserSchema)

export default UserModel
