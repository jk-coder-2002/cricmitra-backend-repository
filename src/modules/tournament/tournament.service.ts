import { tournamentRepository } from './tournament.repository';
import { AppError } from '../../common/errors/AppError';
import { teamRepository } from '../team/team.repository';

export class TournamentService {
  async createTournament(organizerId: string, data: any) {
    return tournamentRepository.create({ ...data, organizerId });
  }

  async getTournament(tournamentId: string) {
    const tournament = await tournamentRepository.findById(tournamentId);
    if (!tournament) throw new AppError('Tournament not found', 404);
    return tournament;
  }

  async addTeamToTournament(tournamentId: string, teamId: string) {
    const team = await teamRepository.findById(teamId);
    if (!team) throw new AppError('Team not found', 404);

    const tournament = await tournamentRepository.addTeam(tournamentId, teamId);
    if (!tournament) throw new AppError('Tournament not found', 404);
    return tournament;
  }
}

export const tournamentService = new TournamentService();
