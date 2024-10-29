import mongoose, { Schema, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  hashedPassword: string;
  createdAt: Date;
}

const userSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// 3. Create a Model
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
