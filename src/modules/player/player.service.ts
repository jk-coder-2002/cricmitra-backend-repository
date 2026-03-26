import { playerRepository } from './player.repository';
import { Player } from './player.schema';
import { AppError } from '../../common/errors/AppError';

export class PlayerService {
  async createPlayer(userId: string, data: any) {
    const existing = await Player.findOne({ userId });
    if (existing) {
       throw new AppError('Player profile already exists', 400);
    }
    return Player.create({ userId, ...data });
  }

  async getPlayerProfile(playerId: string) {
    const player = await playerRepository.findById(playerId);
    if (!player) {
      throw new AppError('Player not found', 404);
    }
    return player;
  }
}

export const playerService = new PlayerService();
