import { Router } from 'express';
import { getProfile } from './user.controller';
import { authMiddleware } from '../../common/middleware/auth.middleware';

const router = Router();

router.use(authMiddleware as any);

router.get('/profile', getProfile);

export default router;
