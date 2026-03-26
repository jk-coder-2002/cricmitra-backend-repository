import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export const RoleGuard = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return next(new AppError('Unauthorized', 401));
    }
    const hasRole = user.roles.some((role: string) => requiredRoles.includes(role));
    if (!hasRole && !user.roles.includes('SuperAdmin')) {
      return next(new AppError('Forbidden: Insufficient role', 403));
    }
    next();
  };
};
