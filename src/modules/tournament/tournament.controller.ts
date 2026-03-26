import { Request, Response, NextFunction } from 'express';
import { tournamentService } from './tournament.service';

export const createTournament = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await tournamentService.createTournament((req as any).user.userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getTournament = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await tournamentService.getTournament(req.params.id as string);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const addTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await tournamentService.addTeamToTournament(req.params.id as string, req.body.teamId as string);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
