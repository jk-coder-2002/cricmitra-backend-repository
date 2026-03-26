import { Router } from 'express';
import { createTournament, getTournament, addTeam } from './tournament.controller';
import { authMiddleware, requirePermission } from '../../common/middleware/auth.middleware';

const router = Router();

router.use(authMiddleware as any);

router.post('/', requirePermission(['manage_tournament']) as any, createTournament);
router.get('/:id', getTournament);
router.post('/:id/teams', requirePermission(['manage_tournament']) as any, addTeam);

export default router;
