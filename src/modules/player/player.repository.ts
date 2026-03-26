import { Player, IPlayer } from './player.schema';

export class PlayerRepository {
  async findById(playerId: string): Promise<IPlayer | null> {
    return Player.findById(playerId).exec();
  }
}

export const playerRepository = new PlayerRepository();
