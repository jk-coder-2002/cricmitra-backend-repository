import mongoose, { Schema, Document } from 'mongoose';

export interface IAuction extends Document {
  name: string;
  tournamentId?: mongoose.Types.ObjectId;
  status: 'upcoming' | 'live' | 'completed';
  currentPlayerId?: mongoose.Types.ObjectId;
  basePrice?: number;
  currentBid?: number;
  currentWinningTeamId?: mongoose.Types.ObjectId;
  bidIncrement: number;
  timerEndTime?: Date;
}

const AuctionSchema = new Schema({
  name: { type: String, required: true },
  tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament' },
  status: { type: String, enum: ['upcoming', 'live', 'completed'], default: 'upcoming' },
  currentPlayerId: { type: Schema.Types.ObjectId, ref: 'Player' },
  basePrice: { type: Number },
  currentBid: { type: Number },
  currentWinningTeamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  bidIncrement: { type: Number, required: true, default: 100000 },
  timerEndTime: { type: Date }
}, { timestamps: true });

export const Auction = mongoose.model<IAuction>('Auction', AuctionSchema);
