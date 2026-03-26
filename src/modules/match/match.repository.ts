import { Match, IMatch } from './match.schema';
import { APIFeatures } from '../../common/utils/apiFeatures';

export class MatchRepository {
  async create(data: Partial<IMatch>): Promise<IMatch> {
    return Match.create(data);
  }

  async findById(matchId: string): Promise<IMatch | null> {
    return Match.findById(matchId)
      .populate('teamAId')
      .populate('teamBId')
      .populate('scorerId')
      .exec();
  }

  async findAll(queryString: any): Promise<IMatch[]> {
    const features = new APIFeatures(Match.find(), queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    return features.query.exec();
  }

  async updateToss(matchId: string, data: any): Promise<IMatch | null> {
    return Match.findByIdAndUpdate(
      matchId,
      { toss: data, status: 'live' },
      { new: true }
    ).exec();
  }
}

export const matchRepository = new MatchRepository();
