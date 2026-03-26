import { Router } from 'express';
import { getUserNotifications, markNotificationRead } from './notification.controller';
import { authMiddleware } from '../../common/middleware/auth.middleware';

const router = Router();

router.use(authMiddleware as any);

router.get('/', getUserNotifications);
router.patch('/:id/read', markNotificationRead);

export default router;
