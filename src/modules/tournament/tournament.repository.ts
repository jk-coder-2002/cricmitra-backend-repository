import { Tournament, ITournament } from './tournament.schema';

export class TournamentRepository {
  async create(data: Partial<ITournament>): Promise<ITournament> {
    return Tournament.create(data);
  }

  async findById(id: string): Promise<ITournament | null> {
    return Tournament.findById(id).populate('teams').exec();
  }

  async addTeam(tournamentId: string, teamId: string): Promise<ITournament | null> {
    return Tournament.findByIdAndUpdate(
      tournamentId,
      { $addToSet: { teams: teamId } },
      { new: true }
    ).exec();
  }
}

export const tournamentRepository = new TournamentRepository();
