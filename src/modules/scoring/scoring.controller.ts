import { Request, Response, NextFunction } from 'express';
import { scoringService } from './scoring.service';

export const addBall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await scoringService.addBall(req.params.matchId as string, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMatchScore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await scoringService.getMatchScore(req.params.matchId as string);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
