import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  phone?: string;
  isActive: boolean;
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
