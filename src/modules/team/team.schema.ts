import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  shortName: string;
  logoUrl?: string;
  captainId: mongoose.Types.ObjectId;
  organizerId: mongoose.Types.ObjectId;
  players: mongoose.Types.ObjectId[];
  stats: {
    matchesPlayed: number;
    wins: number;
    losses: number;
    ties: number;
  };
}

const TeamSchema = new Schema({
  name: { type: String, required: true },
  shortName: { type: String, required: true, uppercase: true, trim: true },
  logoUrl: { type: String },
  captainId: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  organizerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
  stats: {
    matchesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    ties: { type: Number, default: 0 }
  }
}, { timestamps: true });

export const Team = mongoose.model<ITeam>('Team', TeamSchema);
