import { Request, Response, NextFunction } from 'express';
import { statsService } from './stats.service';

export const getPlayerStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await statsService.getPlayerStats(req.params.playerId as string);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
