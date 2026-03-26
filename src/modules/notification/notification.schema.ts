import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'match_update' | 'tournament_alert' | 'event_driven';
  isRead: boolean;
  link?: string;
}

const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['match_update', 'tournament_alert', 'event_driven'], default: 'event_driven' },
  isRead: { type: Boolean, default: false },
  link: { type: String }
}, { timestamps: true });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
