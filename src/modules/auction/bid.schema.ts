import mongoose, { Schema, Document } from 'mongoose';

export interface IBid extends Document {
  auctionId: mongoose.Types.ObjectId;
  playerId: mongoose.Types.ObjectId;
  teamId: mongoose.Types.ObjectId;
  bidAmount: number;
  timestamp: Date;
}

const BidSchema = new Schema({
  auctionId: { type: Schema.Types.ObjectId, ref: 'Auction', required: true },
  playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  bidAmount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

BidSchema.index({ auctionId: 1, playerId: 1 });

export const Bid = mongoose.model<IBid>('Bid', BidSchema);
