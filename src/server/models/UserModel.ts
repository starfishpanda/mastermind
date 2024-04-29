import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wins: { type: Number, default: 0},
  losses: { type: Number, default: 0},
  favoriteNumber: { type: Number},
  
}, { timestamps: true});

const UserModel = model('User', UserSchema);

export default UserModel;