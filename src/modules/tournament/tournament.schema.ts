import mongoose, { Schema, Document } from 'mongoose';

export interface ITournament extends Document {
  name: string;
  organizerId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'ongoing' | 'completed';
  teams: mongoose.Types.ObjectId[];
  format: 'league' | 'knockout';
}

const TournamentSchema = new Schema({
  name: { type: String, required: true },
  organizerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
  teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  format: { type: String, enum: ['league', 'knockout'], default: 'league' }
}, { timestamps: true });

export const Tournament = mongoose.model<ITournament>('Tournament', TournamentSchema);
