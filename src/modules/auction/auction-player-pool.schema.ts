import mongoose, { Schema, Document } from 'mongoose';

export interface IAuctionPlayerPool extends Document {
  auctionId: mongoose.Types.ObjectId;
  playerId: mongoose.Types.ObjectId;
  basePrice: number;
  soldPrice?: number;
  soldToTeamId?: mongoose.Types.ObjectId;
  status: 'upcoming' | 'unsold' | 'sold';
}

const AuctionPlayerPoolSchema = new Schema({
  auctionId: { type: Schema.Types.ObjectId, ref: 'Auction', required: true },
  playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  basePrice: { type: Number, required: true },
  soldPrice: { type: Number },
  soldToTeamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  status: { type: String, enum: ['upcoming', 'unsold', 'sold'], default: 'upcoming' }
}, { timestamps: true });

AuctionPlayerPoolSchema.index({ auctionId: 1, playerId: 1 }, { unique: true });

export const AuctionPlayerPool = mongoose.model<IAuctionPlayerPool>('AuctionPlayerPool', AuctionPlayerPoolSchema);
