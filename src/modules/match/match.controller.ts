import { Request, Response, NextFunction } from 'express';
import { matchService } from './match.service';

export const createMatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await matchService.createMatch((req as any).user.userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await matchService.getMatch(req.params.id as string);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllMatches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await matchService.getAllMatches(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateToss = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await matchService.updateToss(req.params.id as string, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
