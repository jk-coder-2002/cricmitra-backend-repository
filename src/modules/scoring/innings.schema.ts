import mongoose, { Schema, Document } from 'mongoose';

export interface IInnings extends Document {
  matchId: mongoose.Types.ObjectId;
  battingTeamId: mongoose.Types.ObjectId;
  bowlingTeamId: mongoose.Types.ObjectId;
  inningsNumber: number;
  totalRuns: number;
  totalWickets: number;
  totalLegalBalls: number;
  isCompleted: boolean;
  overs: string; // Virtual property getter representation
}

const InningsSchema = new Schema({
  matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
  battingTeamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  bowlingTeamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  inningsNumber: { type: Number, required: true, min: 1, max: 4 },
  totalRuns: { type: Number, default: 0 },
  totalWickets: { type: Number, default: 0 },
  totalLegalBalls: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

InningsSchema.virtual('overs').get(function() {
  const overs = Math.floor(this.totalLegalBalls / 6);
  const balls = this.totalLegalBalls % 6;
  return `${overs}.${balls}`;
});

InningsSchema.index({ matchId: 1, inningsNumber: 1 }, { unique: true });

export const Innings = mongoose.model<IInnings>('Innings', InningsSchema);
