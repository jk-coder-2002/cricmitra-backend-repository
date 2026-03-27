import { auctionService } from '../auction.service';
import { auctionRepository } from '../auction.repository';
import { redlock } from '../../../common/utils/redis';
import { AppError } from '../../../common/errors/AppError';
import mongoose from 'mongoose';

jest.mock('../auction.repository');
jest.mock('../../../common/utils/redis', () => ({
  redlock: {
    acquire: jest.fn()
  },
  redisClient: {
    set: jest.fn(),
    get: jest.fn()
  }
}));

jest.mock('../../../sockets', () => ({
  getIo: () => ({
    to: () => ({ emit: jest.fn() })
  })
}));

describe('AuctionService Bidding Concurrency', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('placeBid', () => {
    it('should acquire lock, validate bid, update DB, and release lock', async () => {
      const mockLock = { release: jest.fn() };
      (redlock.acquire as jest.Mock).mockResolvedValue(mockLock);

      (auctionRepository.getAuctionById as jest.Mock).mockResolvedValue({
        _id: 'auction1',
        status: 'live',
        currentPlayerId: 'player1',
        basePrice: 100000,
        currentBid: 0,
        bidIncrement: 50000
      });

      (auctionRepository.getTeamAuction as jest.Mock).mockResolvedValue({
        teamId: 'team1',
        purseRemaining: 5000000,
        playersBought: [],
        maxPlayersLimit: 25
      });

      const mockSession = {
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn()
      };
      jest.spyOn(mongoose, 'startSession').mockResolvedValue(mockSession as any);

      (auctionRepository.recordBid as jest.Mock).mockResolvedValue({ bidAmount: 100000 });
      (auctionRepository.updateAuction as jest.Mock).mockResolvedValue(true);

      const result = await auctionService.placeBid('auction1', { teamId: 'team1', bidAmount: 100000 });

      expect(redlock.acquire).toHaveBeenCalledWith(['lock:auction:auction1'], 2000);
      expect(auctionRepository.recordBid).toHaveBeenCalled();
      expect(auctionRepository.updateAuction).toHaveBeenCalled();
      expect(mockSession.commitTransaction).toHaveBeenCalled();
      expect(mockLock.release).toHaveBeenCalled();
      expect(result.bidAmount).toBe(100000);
    });

    it('should throw AppError if bid is lower than minimum increment', async () => {
      const mockLock = { release: jest.fn() };
      (redlock.acquire as jest.Mock).mockResolvedValue(mockLock);

      (auctionRepository.getAuctionById as jest.Mock).mockResolvedValue({
        _id: 'auction1',
        status: 'live',
        currentPlayerId: 'player1',
        basePrice: 100000,
        currentBid: 150000, // Current bid is 150000
        bidIncrement: 50000 // Next valid bid must be 200000
      });

      await expect(auctionService.placeBid('auction1', { teamId: 'team1', bidAmount: 160000 }))
        .rejects.toThrow('Bid amount must be at least 200000');

      expect(mockLock.release).toHaveBeenCalled(); // Lock MUST be released even on error
    });
  });
});
