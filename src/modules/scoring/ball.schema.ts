import mongoose, { Schema, Document } from 'mongoose';

export interface IBall extends Document {
  inningsId: mongoose.Types.ObjectId;
  matchId: mongoose.Types.ObjectId;
  overNumber: number;
  ballNumber: number;
  bowlerId: mongoose.Types.ObjectId;
  batsmanId: mongoose.Types.ObjectId;
  nonStrikerId: mongoose.Types.ObjectId;
  runsBat: number;
  extras: {
    type: 'wide' | 'noBall' | 'legBye' | 'bye' | 'penalty' | 'none';
    runs: number;
  };
  isWicket: boolean;
  wicketType?: 'bowled' | 'caught' | 'lbw' | 'runOut' | 'stumped' | 'hitWicket' | 'obstructingTheField' | 'retiredHurt';
  playerOutId?: mongoose.Types.ObjectId;
  fielderId?: mongoose.Types.ObjectId;
}

const BallSchema = new Schema({
  inningsId: { type: Schema.Types.ObjectId, ref: 'Innings', required: true },
  matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
  overNumber: { type: Number, required: true },
  ballNumber: { type: Number, required: true }, // within over (1-6+)
  bowlerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  batsmanId: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  nonStrikerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  runsBat: { type: Number, default: 0 },
  extras: {
    type: { type: String, enum: ['wide', 'noBall', 'legBye', 'bye', 'penalty', 'none'], default: 'none' },
    runs: { type: Number, default: 0 }
  },
  isWicket: { type: Boolean, default: false },
  wicketType: { type: String, enum: ['bowled', 'caught', 'lbw', 'runOut', 'stumped', 'hitWicket', 'obstructingTheField', 'retiredHurt'] },
  playerOutId: { type: Schema.Types.ObjectId, ref: 'Player' },
  fielderId: { type: Schema.Types.ObjectId, ref: 'Player' }
}, { timestamps: true });

BallSchema.index({ inningsId: 1, overNumber: 1, ballNumber: 1 }, { unique: true });
BallSchema.index({ matchId: 1 });

export const Ball = mongoose.model<IBall>('Ball', BallSchema);
