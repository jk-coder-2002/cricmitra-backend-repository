import { Notification, INotification } from './notification.schema';

export class NotificationRepository {
  async create(data: Partial<INotification>): Promise<INotification> {
    return Notification.create(data);
  }

  async findByUserId(userId: string): Promise<INotification[]> {
    return Notification.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async markAsRead(notificationId: string): Promise<INotification | null> {
    return Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true }).exec();
  }
}

export const notificationRepository = new NotificationRepository();
