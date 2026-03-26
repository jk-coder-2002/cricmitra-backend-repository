import { statsRepository } from './stats.repository';
import { AppError } from '../../common/errors/AppError';

export class StatsService {
  async getPlayerStats(playerId: string) {
    const stats = await statsRepository.getPlayerStats(playerId);
    if (!stats) throw new AppError('Stats not found', 404);
    return stats;
  }
}

export const statsService = new StatsService();
