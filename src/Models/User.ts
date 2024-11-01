import mongoose, { Schema, Model } from 'mongoose';
import IUser from '../Interfaces/IUser';

const userSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
