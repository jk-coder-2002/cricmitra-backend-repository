import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  teamAId: mongoose.Types.ObjectId;
  teamBId: mongoose.Types.ObjectId;
  tournamentId?: mongoose.Types.ObjectId;
  organizerId: mongoose.Types.ObjectId;
  scorerId?: mongoose.Types.ObjectId;
  status: 'upcoming' | 'live' | 'completed';
  venue: string;
  matchDate: Date;
  overs: number;
  toss?: {
    wonBy: mongoose.Types.ObjectId;
    decision: 'bat' | 'bowl';
  };
  result?: {
    winnerId?: mongoose.Types.ObjectId;
    wonByRuns?: number;
    wonByWickets?: number;
    isTie?: boolean;
    isDraw?: boolean;
    isAbandoned?: boolean;
  };
  playingXI: {
    teamA: mongoose.Types.ObjectId[];
    teamB: mongoose.Types.ObjectId[];
  };
}

const MatchSchema = new Schema({
  teamAId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  teamBId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament' },
  organizerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  scorerId: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['upcoming', 'live', 'completed'], default: 'upcoming' },
  venue: { type: String, required: true },
  matchDate: { type: Date, required: true },
  overs: { type: Number, required: true },
  toss: {
    wonBy: { type: Schema.Types.ObjectId, ref: 'Team' },
    decision: { type: String, enum: ['bat', 'bowl'] }
  },
  result: {
    winnerId: { type: Schema.Types.ObjectId, ref: 'Team' },
    wonByRuns: { type: Number },
    wonByWickets: { type: Number },
    isTie: { type: Boolean, default: false },
    isDraw: { type: Boolean, default: false },
    isAbandoned: { type: Boolean, default: false }
  },
  playingXI: {
    teamA: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    teamB: [{ type: Schema.Types.ObjectId, ref: 'Player' }]
  }
}, { timestamps: true });

MatchSchema.index({ status: 1, matchDate: 1 });
MatchSchema.index({ teamAId: 1, teamBId: 1 });

export const Match = mongoose.model<IMatch>('Match', MatchSchema);
