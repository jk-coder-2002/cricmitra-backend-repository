import { Router } from 'express';
import { createMatch, getMatch, getAllMatches, updateToss } from './match.controller';
import { authMiddleware, requirePermission } from '../../common/middleware/auth.middleware';
import { validateRequest } from '../../common/middleware/validation.middleware';
import { createMatchSchema, updateTossSchema } from './match.dto';

const router = Router();

router.get('/', getAllMatches);
router.get('/:id', getMatch);

router.use(authMiddleware as any);

router.post('/', requirePermission(['create_match']) as any, validateRequest(createMatchSchema), createMatch);
router.patch('/:id/toss', requirePermission(['update_score']) as any, validateRequest(updateTossSchema), updateToss);

export default router;
