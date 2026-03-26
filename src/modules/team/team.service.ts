import { teamRepository } from './team.repository';
import { playerRepository } from '../player/player.repository';
import { AppError } from '../../common/errors/AppError';

export class TeamService {
  async createTeam(organizerId: string, data: any) {
    const captain = await playerRepository.findById(data.captainId);
    if (!captain) {
      throw new AppError('Captain player not found', 404);
    }

    const team = await teamRepository.create({
      ...data,
      organizerId,
      players: [data.captainId]
    });
    return team;
  }

  async getTeam(teamId: string) {
    const team = await teamRepository.findById(teamId);
    if (!team) {
      throw new AppError('Team not found', 404);
    }
    return team;
  }

  async addPlayer(teamId: string, playerId: string) {
    const player = await playerRepository.findById(playerId);
    if (!player) {
      throw new AppError('Player not found', 404);
    }
    const team = await teamRepository.addPlayer(teamId, playerId);
    if (!team) {
       throw new AppError('Team not found', 404);
    }
    return team;
  }
}

export const teamService = new TeamService();
