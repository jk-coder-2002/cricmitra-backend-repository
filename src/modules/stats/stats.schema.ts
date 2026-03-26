import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayerStats extends Document {
  playerId: mongoose.Types.ObjectId;
  tournamentId?: mongoose.Types.ObjectId;
  matches: number;
  runs: number;
  wickets: number;
  fifties: number;
  hundreds: number;
  highestScore: number;
  bestBowling: { wickets: number; runs: number };
}

const PlayerStatsSchema = new Schema({
  playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament' },
  matches: { type: Number, default: 0 },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  fifties: { type: Number, default: 0 },
  hundreds: { type: Number, default: 0 },
  highestScore: { type: Number, default: 0 },
  bestBowling: {
    wickets: { type: Number, default: 0 },
    runs: { type: Number, default: 0 }
  }
}, { timestamps: true });

PlayerStatsSchema.index({ playerId: 1, tournamentId: 1 }, { unique: true });

export const PlayerStats = mongoose.model<IPlayerStats>('PlayerStats', PlayerStatsSchema);
