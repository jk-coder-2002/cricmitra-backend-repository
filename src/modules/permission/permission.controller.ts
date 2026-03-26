import { Request, Response, NextFunction } from 'express';
import { permissionService } from './permission.service';

export const createPermission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await permissionService.createPermission(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await permissionService.getPermissions();
    res.json(result);
  } catch (error) {
    next(error);
  }
};
