import { Router } from 'express';
import { createTeam, getTeam, addPlayerToTeam } from './team.controller';
import { authMiddleware, requirePermission } from '../../common/middleware/auth.middleware';
import { validateRequest } from '../../common/middleware/validation.middleware';
import { createTeamSchema } from './team.dto';

const router = Router();

router.use(authMiddleware as any);

router.post('/', requirePermission(['manage_team']) as any, validateRequest(createTeamSchema), createTeam);
router.get('/:id', getTeam);
router.post('/:id/players', requirePermission(['manage_team']) as any, addPlayerToTeam);

export default router;
