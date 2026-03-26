import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  name: string;
  description?: string;
}

const RoleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String }
}, { timestamps: true });

export const Role = mongoose.model<IRole>('Role', RoleSchema);
