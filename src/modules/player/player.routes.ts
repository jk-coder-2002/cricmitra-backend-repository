import { Router } from 'express';
import { createProfile, getProfile } from './player.controller';
import { authMiddleware } from '../../common/middleware/auth.middleware';

const router = Router();

router.use(authMiddleware as any);

router.post('/profile', createProfile);
router.get('/:id', getProfile);

export default router;
