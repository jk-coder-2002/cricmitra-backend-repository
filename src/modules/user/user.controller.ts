import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getUserProfile((req as any).user.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
