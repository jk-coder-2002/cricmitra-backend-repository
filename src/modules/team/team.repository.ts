import { Team, ITeam } from './team.schema';

export class TeamRepository {
  async create(data: Partial<ITeam>): Promise<ITeam> {
    return Team.create(data);
  }

  async findById(teamId: string): Promise<ITeam | null> {
    return Team.findById(teamId).populate('players').populate('captainId').exec();
  }

  async addPlayer(teamId: string, playerId: string): Promise<ITeam | null> {
    return Team.findByIdAndUpdate(
      teamId,
      { $addToSet: { players: playerId } },
      { new: true }
    ).exec();
  }
}

export const teamRepository = new TeamRepository();
