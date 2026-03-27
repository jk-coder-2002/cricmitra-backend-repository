import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamAuction extends Document {
  auctionId: mongoose.Types.ObjectId;
  teamId: mongoose.Types.ObjectId;
  purseRemaining: number;
  playersBought: mongoose.Types.ObjectId[];
  maxPlayersLimit: number;
}

const TeamAuctionSchema = new Schema({
  auctionId: { type: Schema.Types.ObjectId, ref: 'Auction', required: true },
  teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  purseRemaining: { type: Number, required: true },
  playersBought: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
  maxPlayersLimit: { type: Number, required: true, default: 25 }
}, { timestamps: true });

TeamAuctionSchema.index({ auctionId: 1, teamId: 1 }, { unique: true });

export const TeamAuction = mongoose.model<ITeamAuction>('TeamAuction', TeamAuctionSchema);
