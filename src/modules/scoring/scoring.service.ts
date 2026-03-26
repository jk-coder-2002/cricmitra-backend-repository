import { scoringRepository } from './scoring.repository';
import { AppError } from '../../common/errors/AppError';
import { getIo } from '../../sockets';
import mongoose from 'mongoose';
import { statsRepository } from '../stats/stats.repository';

export class ScoringService {
  async addBall(matchId: string, data: any) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const match = await scoringRepository.getMatchWithSession(matchId, session);
      if (!match) throw new AppError('Match not found', 404);
      if (match.status !== 'live') throw new AppError('Match is not live', 400);

      const innings = await scoringRepository.getInningsWithSession(data.inningsId, session);
      if (!innings) throw new AppError('Innings not found', 404);
      if (innings.isCompleted) throw new AppError('Innings is already completed', 400);

      const totalRunsThisBall = data.runsBat + (data.extras?.runs || 0);

      const ballData = {
        ...data,
        matchId,
      };

      const ball = await scoringRepository.saveBallWithSession(ballData, session);

      innings.totalRuns += totalRunsThisBall;

      let isLegalDelivery = true;
      if (data.extras.type === 'wide' || data.extras.type === 'noBall') {
        isLegalDelivery = false;
      }

      if (data.isWicket) {
        innings.totalWickets += 1;

        // Update Bowler Wickets
        if (data.wicketType !== 'runOut' && data.wicketType !== 'retiredHurt' && data.wicketType !== 'obstructingTheField') {
          await statsRepository.updateStats(data.bowlerId, { wickets: 1 }, session);
        }
      }

      if (isLegalDelivery) {
          innings.totalLegalBalls += 1;
      }

      await scoringRepository.saveInningsWithSession(innings, session);

      // Update Batsman Runs
      if (data.runsBat > 0) {
        await statsRepository.updateStats(data.batsmanId, { runs: data.runsBat }, session);
      }

      await session.commitTransaction();

      const io = getIo();
      io.to(matchId).emit('ball_added', ball);
      io.to(matchId).emit('score_updated', {
         inningsId: innings._id,
         totalRuns: innings.totalRuns,
         totalWickets: innings.totalWickets,
         overs: innings.overs
      });

      return ball;

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getMatchScore(matchId: string) {
      return scoringRepository.findInningsByMatchId(matchId);
  }
}

export const scoringService = new ScoringService();
