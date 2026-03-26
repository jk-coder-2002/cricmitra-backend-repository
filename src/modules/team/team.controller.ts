import { Request, Response, NextFunction } from 'express';
import { teamService } from './team.service';

export const createTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await teamService.createTeam((req as any).user.userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await teamService.getTeam(req.params.id as string);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const addPlayerToTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await teamService.addPlayer(req.params.id as string, req.body.playerId as string);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
