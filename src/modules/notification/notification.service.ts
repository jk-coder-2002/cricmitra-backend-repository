import { notificationRepository } from './notification.repository';
import { getIo } from '../../sockets';
import logger from '../../common/utils/logger';

export class NotificationService {
  async sendNotification(data: { userId: string; title: string; message: string; type: string; link?: string }) {
    try {
      const notification = await notificationRepository.create(data as any);

      const io = getIo();
      io.to(data.userId).emit('notification', notification);

      return notification;
    } catch (error) {
      logger.error('Failed to send notification', error);
      throw error;
    }
  }

  async getUserNotifications(userId: string) {
    return notificationRepository.findByUserId(userId);
  }

  async markAsRead(notificationId: string) {
    return notificationRepository.markAsRead(notificationId);
  }
}

export const notificationService = new NotificationService();
