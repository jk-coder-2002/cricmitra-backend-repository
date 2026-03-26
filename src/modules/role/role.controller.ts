import { Request, Response, NextFunction } from 'express';
import { roleService } from './role.service';

export const createRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await roleService.createRole(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await roleService.getRoles();
    res.json(result);
  } catch (error) {
    next(error);
  }
};
