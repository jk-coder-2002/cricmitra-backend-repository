import { Router } from 'express';
import { createAuction, startAuction, addPlayerToPool, addTeamToAuction, placeBid, getAuctionStatus } from './auction.controller';
import { authMiddleware, requirePermission } from '../../common/middleware/auth.middleware';
import { validateRequest } from '../../common/middleware/validation.middleware';
import { createAuctionSchema, addPlayerToPoolSchema, addTeamToAuctionSchema, placeBidSchema } from './dto/auction.dto';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting specifically for bidding to prevent spam
const bidLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 20, // max 20 bids per 10 seconds per IP
  message: 'Too many bids placed from this IP, please try again after a few seconds'
});

router.get('/:id/status', getAuctionStatus);

router.use(authMiddleware as any);

router.post('/create', requirePermission(['manage_tournament']) as any, validateRequest(createAuctionSchema), createAuction);
router.post('/:id/start', requirePermission(['manage_tournament']) as any, startAuction);
router.post('/:id/add-player', requirePermission(['manage_tournament']) as any, validateRequest(addPlayerToPoolSchema), addPlayerToPool);
router.post('/:id/add-team', requirePermission(['manage_tournament']) as any, validateRequest(addTeamToAuctionSchema), addTeamToAuction);
router.post('/:id/bid', bidLimiter, requirePermission(['participate_auction']) as any, validateRequest(placeBidSchema), placeBid);

export default router;
