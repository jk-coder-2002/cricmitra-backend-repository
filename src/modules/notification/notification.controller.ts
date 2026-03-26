import { Request, Response, NextFunction } from 'express';
import { notificationService } from './notification.service';

export const getUserNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await notificationService.getUserNotifications((req as any).user.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await notificationService.markAsRead(req.params.id as string);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
