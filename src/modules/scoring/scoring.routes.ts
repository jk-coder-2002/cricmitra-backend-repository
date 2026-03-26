import { Router } from 'express';
import { addBall, getMatchScore } from './scoring.controller';
import { authMiddleware, requirePermission } from '../../common/middleware/auth.middleware';
import { validateRequest } from '../../common/middleware/validation.middleware';
import { addBallSchema } from './scoring.dto';

const router = Router();

router.get('/:matchId', getMatchScore);

router.use(authMiddleware as any);
router.post('/:matchId/ball', requirePermission(['update_score']) as any, validateRequest(addBallSchema), addBall);

export default router;
