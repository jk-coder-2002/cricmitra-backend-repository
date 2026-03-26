import { Router } from 'express';
import { register, login } from './auth.controller';
import { validateRequest } from '../../common/middleware/validation.middleware';
import { registerSchema, loginSchema } from './auth.dto';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

export default router;
