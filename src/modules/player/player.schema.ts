import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
  userId: mongoose.Types.ObjectId;
  battingStyle?: string;
  bowlingStyle?: string;
  matchesPlayed: number;
  runsScored: number;
  wicketsTaken: number;
}

const PlayerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  battingStyle: { type: String, enum: ['Right-hand bat', 'Left-hand bat'] },
  bowlingStyle: { type: String, enum: ['Right-arm fast', 'Right-arm medium', 'Right-arm spin', 'Left-arm fast', 'Left-arm medium', 'Left-arm spin'] },
  matchesPlayed: { type: Number, default: 0 },
  runsScored: { type: Number, default: 0 },
  wicketsTaken: { type: Number, default: 0 }
}, { timestamps: true });

export const Player = mongoose.model<IPlayer>('Player', PlayerSchema);
