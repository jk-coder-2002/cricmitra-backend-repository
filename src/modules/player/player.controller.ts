import { Request, Response, NextFunction } from 'express';
import { playerService } from './player.service';

export const createProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await playerService.createPlayer((req as any).user.userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await playerService.getPlayerProfile(req.params.id as string);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
