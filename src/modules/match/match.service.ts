import { matchRepository } from './match.repository';
import { AppError } from '../../common/errors/AppError';

export class MatchService {
  async createMatch(organizerId: string, data: any) {
    if (data.teamAId === data.teamBId) {
      throw new AppError('A team cannot play against itself', 400);
    }
    const match = await matchRepository.create({
      ...data,
      organizerId,
      status: 'upcoming'
    });
    return match;
  }

  async getMatch(matchId: string) {
    const match = await matchRepository.findById(matchId);
    if (!match) throw new AppError('Match not found', 404);
    return match;
  }

  async getAllMatches(queryString: any) {
    return matchRepository.findAll(queryString);
  }

  async updateToss(matchId: string, data: { wonBy: string, decision: 'bat' | 'bowl' }) {
    const match = await matchRepository.updateToss(matchId, data);
    if (!match) throw new AppError('Match not found', 404);
    return match;
  }
}

export const matchService = new MatchService();
