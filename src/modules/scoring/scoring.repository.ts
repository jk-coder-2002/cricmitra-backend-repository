import { Ball, IBall } from './ball.schema';
import { Innings, IInnings } from './innings.schema';
import { Match, IMatch } from '../match/match.schema';
import mongoose from 'mongoose';

export class ScoringRepository {
  async getMatchWithSession(matchId: string, session: mongoose.ClientSession): Promise<IMatch | null> {
    return Match.findById(matchId).session(session).exec();
  }

  async getInningsWithSession(inningsId: string, session: mongoose.ClientSession): Promise<IInnings | null> {
    return Innings.findById(inningsId).session(session).exec();
  }

  async saveBallWithSession(data: Partial<IBall>, session: mongoose.ClientSession): Promise<IBall> {
    const ball = new Ball(data);
    return ball.save({ session });
  }

  async saveInningsWithSession(innings: IInnings, session: mongoose.ClientSession): Promise<IInnings> {
    return innings.save({ session });
  }

  async findInningsByMatchId(matchId: string): Promise<IInnings[]> {
     return Innings.find({ matchId }).exec();
  }
}

export const scoringRepository = new ScoringRepository();
