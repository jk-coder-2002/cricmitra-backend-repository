import { Auction, IAuction } from './auction.schema';
import { AuctionPlayerPool, IAuctionPlayerPool } from './auction-player-pool.schema';
import { TeamAuction, ITeamAuction } from './team-auction.schema';
import { Bid, IBid } from './bid.schema';
import mongoose from 'mongoose';

export class AuctionRepository {
  async createAuction(data: Partial<IAuction>): Promise<IAuction> {
    return Auction.create(data);
  }

  async getAuctionById(auctionId: string): Promise<IAuction | null> {
    return Auction.findById(auctionId).exec();
  }

  async updateAuction(auctionId: string, updateData: Partial<IAuction>, session?: mongoose.ClientSession): Promise<IAuction | null> {
    const options: any = { new: true };
    if (session) options.session = session;
    const result = await Auction.findByIdAndUpdate(auctionId, updateData, options).exec();
    return result as unknown as IAuction | null;
  }

  async addPlayerToPool(data: Partial<IAuctionPlayerPool>): Promise<IAuctionPlayerPool> {
    return AuctionPlayerPool.create(data);
  }

  async getUpcomingPlayers(auctionId: string): Promise<IAuctionPlayerPool[]> {
     return AuctionPlayerPool.find({ auctionId, status: 'upcoming' }).exec();
  }

  async updatePlayerPool(auctionId: string, playerId: string, updateData: Partial<IAuctionPlayerPool>, session?: mongoose.ClientSession): Promise<IAuctionPlayerPool | null> {
      const options: any = { new: true };
      if (session) options.session = session;
      const result = await AuctionPlayerPool.findOneAndUpdate({ auctionId, playerId }, updateData, options).exec();
      return result as unknown as IAuctionPlayerPool | null;
  }

  async addTeamToAuction(data: Partial<ITeamAuction>): Promise<ITeamAuction> {
    return TeamAuction.create(data);
  }

  async getTeamAuction(auctionId: string, teamId: string): Promise<ITeamAuction | null> {
    return TeamAuction.findOne({ auctionId, teamId }).exec();
  }

  async updateTeamPurse(auctionId: string, teamId: string, amountToDeduct: number, playerId: string, session?: mongoose.ClientSession): Promise<ITeamAuction | null> {
      const options: any = { new: true };
      if (session) options.session = session;
      const result = await TeamAuction.findOneAndUpdate(
          { auctionId, teamId },
          {
              $inc: { purseRemaining: -amountToDeduct },
              $push: { playersBought: playerId }
          },
          options
      ).exec();
      return result as unknown as ITeamAuction | null;
  }

  async recordBid(data: Partial<IBid>, session?: mongoose.ClientSession): Promise<IBid> {
      const bid = new Bid(data);
      if (session) {
         return bid.save({ session });
      }
      return bid.save();
  }

  async getBidsForPlayer(auctionId: string, playerId: string): Promise<IBid[]> {
      return Bid.find({ auctionId, playerId }).sort({ timestamp: -1 }).exec();
  }
}

export const auctionRepository = new AuctionRepository();
