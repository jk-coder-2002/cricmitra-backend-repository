import { Router } from 'express';
import { createPermission, getPermissions } from './permission.controller';
import { authMiddleware, requireRole } from '../../common/middleware/auth.middleware';

const router = Router();

router.use(authMiddleware as any);
router.use(requireRole(['SuperAdmin']) as any);

router.post('/', createPermission);
router.get('/', getPermissions);

export default router;
