import { PlayerStats, IPlayerStats } from './stats.schema';
import mongoose from 'mongoose';

export class StatsRepository {
  async getPlayerStats(playerId: string): Promise<IPlayerStats | null> {
    return PlayerStats.findOne({ playerId }).exec();
  }

  async updateStats(playerId: string, data: any, session?: mongoose.ClientSession): Promise<IPlayerStats | null> {
     const options: any = { new: true, upsert: true };
     if (session) {
         options.session = session;
     }
     const result = await PlayerStats.findOneAndUpdate({ playerId }, { $inc: data }, options).exec();
     return result as unknown as IPlayerStats | null;
  }
}

export const statsRepository = new StatsRepository();
