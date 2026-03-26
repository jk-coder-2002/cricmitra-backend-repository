import mongoose, { Schema, Document } from 'mongoose';

export interface IPermission extends Document {
  name: string;
  description?: string;
}

const PermissionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String }
}, { timestamps: true });

export const Permission = mongoose.model<IPermission>('Permission', PermissionSchema);
