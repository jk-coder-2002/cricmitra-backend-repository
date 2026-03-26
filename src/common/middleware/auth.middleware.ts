import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { AppError } from '../errors/AppError';
import { UserRole } from '../../modules/user/user.role.schema';
import { RolePermission } from '../../modules/role/role.permission.schema';
import { Role } from '../../modules/role/role.schema';
import { Permission } from '../../modules/permission/permission.schema';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    roles: string[];
    permissions: string[];
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new AppError('No token provided', 401));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };

    // Fetch user roles and permissions
    const userRoles = await UserRole.find({ userId: decoded.userId }).populate('roleId');
    const roleIds = userRoles.map(ur => (ur.roleId as any)._id);
    const roleNames = userRoles.map(ur => (ur.roleId as any).name);

    const rolePermissions = await RolePermission.find({ roleId: { $in: roleIds } }).populate('permissionId');
    const permissionNames = rolePermissions.map(rp => (rp.permissionId as any).name);

    req.user = {
      userId: decoded.userId,
      roles: roleNames,
      permissions: [...new Set(permissionNames)] // Unique permissions
    };

    next();
  } catch (error) {
    return next(new AppError('Invalid token', 401));
  }
};

export const requireRole = (requiredRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }
    const hasRole = req.user.roles.some(role => requiredRoles.includes(role));
    if (!hasRole && !req.user.roles.includes('SuperAdmin')) {
      return next(new AppError('Forbidden: Insufficient role', 403));
    }
    next();
  };
};

export const requirePermission = (requiredPermissions: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }
    if (req.user.roles.includes('SuperAdmin')) {
       return next();
    }
    const hasPermission = req.user.permissions.some(perm => requiredPermissions.includes(perm));
    if (!hasPermission) {
      return next(new AppError('Forbidden: Insufficient permissions', 403));
    }
    next();
  };
};
