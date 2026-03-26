import { Router } from 'express';
import { getPlayerStats } from './stats.controller';

const router = Router();

router.get('/player/:playerId', getPlayerStats);

export default router;
