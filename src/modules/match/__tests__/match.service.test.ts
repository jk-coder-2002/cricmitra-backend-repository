import { matchService } from '../match.service';
import { matchRepository } from '../match.repository';

jest.mock('../match.repository');

describe('MatchService', () => {
  describe('createMatch', () => {
    it('should create a match if teams are different', async () => {
      const mockMatchData = {
        teamAId: 'team1',
        teamBId: 'team2',
        venue: 'Stadium',
        matchDate: new Date(),
        overs: 20
      };
      (matchRepository.create as jest.Mock).mockResolvedValue({ _id: 'match1', ...mockMatchData, organizerId: 'org1', status: 'upcoming' });

      const result = await matchService.createMatch('org1', mockMatchData);
      expect(result._id).toBe('match1');
      expect(result.status).toBe('upcoming');
    });

    it('should throw error if teams are the same', async () => {
       const mockMatchData = {
        teamAId: 'team1',
        teamBId: 'team1',
        venue: 'Stadium',
        matchDate: new Date(),
        overs: 20
      };
      await expect(matchService.createMatch('org1', mockMatchData))
        .rejects.toThrow('A team cannot play against itself');
    });
  });
});
