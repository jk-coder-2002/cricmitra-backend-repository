import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
import roleRoutes from '../modules/role/role.routes';
import permissionRoutes from '../modules/permission/permission.routes';
import teamRoutes from '../modules/team/team.routes';
import playerRoutes from '../modules/player/player.routes';
import matchRoutes from '../modules/match/match.routes';
import scoringRoutes from '../modules/scoring/scoring.routes';
import notificationRoutes from '../modules/notification/notification.routes';
import tournamentRoutes from '../modules/tournament/tournament.routes';
import statsRoutes from '../modules/stats/stats.routes';
import auctionRoutes from '../modules/auction/auction.routes';

const router = Router();

router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/teams', teamRoutes);
router.use('/players', playerRoutes);
router.use('/matches', matchRoutes);
router.use('/scoring', scoringRoutes);
router.use('/notifications', notificationRoutes);
router.use('/tournaments', tournamentRoutes);
router.use('/stats', statsRoutes);
router.use('/auction', auctionRoutes);

export default router;
