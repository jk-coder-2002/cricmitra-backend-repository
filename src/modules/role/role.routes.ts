import { Router } from 'express';
import { createRole, getRoles } from './role.controller';
import { authMiddleware, requireRole } from '../../common/middleware/auth.middleware';

const router = Router();

router.use(authMiddleware as any);
router.use(requireRole(['SuperAdmin']) as any);

router.post('/', createRole);
router.get('/', getRoles);

export default router;
