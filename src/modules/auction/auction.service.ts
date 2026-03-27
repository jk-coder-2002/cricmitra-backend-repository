import { auctionRepository } from './auction.repository';
import { Auction } from './auction.schema';
import { AppError } from '../../common/errors/AppError';
import { getIo } from '../../sockets';
import { redlock, redisClient } from '../../common/utils/redis';
import mongoose from 'mongoose';
import logger from '../../common/utils/logger';

export class AuctionService {
  private readonly TIMER_DURATION = 30; // 30 seconds

  async createAuction(data: any) {
    return auctionRepository.createAuction(data);
  }

  async addTeam(data: any) {
     return auctionRepository.addTeamToAuction(data);
  }

  async addPlayerToPool(auctionId: string, data: any) {
    return auctionRepository.addPlayerToPool({ auctionId: auctionId as any, ...data });
  }

  async startAuction(auctionId: string) {
    const auction = await auctionRepository.getAuctionById(auctionId);
    if (!auction) throw new AppError('Auction not found', 404);
    if (auction.status !== 'upcoming') throw new AppError('Auction is not upcoming', 400);

    const upcomingPlayers = await auctionRepository.getUpcomingPlayers(auctionId);
    if (upcomingPlayers.length === 0) throw new AppError('No players in the auction pool', 400);

    const firstPlayer = upcomingPlayers[0];

    const timerEndTime = new Date(Date.now() + this.TIMER_DURATION * 1000);

    const updatedAuction = await auctionRepository.updateAuction(auctionId, {
      status: 'live',
      currentPlayerId: firstPlayer.playerId,
      basePrice: firstPlayer.basePrice,
      currentBid: 0,
      currentWinningTeamId: null as any, // Use null instead of undefined
      timerEndTime
    });

    await this.startTimer(auctionId, firstPlayer.playerId as unknown as string, this.TIMER_DURATION);

    getIo().to(`auction_${auctionId}`).emit('auction_started', {
      auctionId,
      currentPlayerId: firstPlayer.playerId,
      basePrice: firstPlayer.basePrice,
      timerEndTime
    });

    return updatedAuction;
  }

  async placeBid(auctionId: string, data: { teamId: string, bidAmount: number }) {
      const lockKey = `lock:auction:${auctionId}`;
      let lock;

      try {
          lock = await redlock.acquire([lockKey], 2000);

          const auction = await auctionRepository.getAuctionById(auctionId);
          if (!auction || auction.status !== 'live') {
              throw new AppError('Auction is not active', 400);
          }
          if (!auction.currentPlayerId) {
              throw new AppError('No player currently up for auction', 400);
          }

          const currentBid = auction.currentBid || 0;
          const basePrice = auction.basePrice || 0;
          const requiredMinBid = currentBid === 0 ? basePrice : currentBid + auction.bidIncrement;

          if (data.bidAmount < requiredMinBid) {
              throw new AppError(`Bid amount must be at least ${requiredMinBid}`, 400);
          }

          const teamAuction = await auctionRepository.getTeamAuction(auctionId, data.teamId);
          if (!teamAuction) {
             throw new AppError('Team is not registered for this auction', 400);
          }
          if (teamAuction.purseRemaining < data.bidAmount) {
             throw new AppError('Insufficient purse balance', 400);
          }
          if (teamAuction.playersBought.length >= teamAuction.maxPlayersLimit) {
             throw new AppError('Team has reached maximum player limit', 400);
          }

          const session = await mongoose.startSession();
          session.startTransaction();

          let newBid;
          try {
              newBid = await auctionRepository.recordBid({
                  auctionId: auctionId as any,
                  playerId: auction.currentPlayerId,
                  teamId: data.teamId as any,
                  bidAmount: data.bidAmount
              }, session);

              await auctionRepository.updateAuction(auctionId, {
                  currentBid: data.bidAmount,
                  currentWinningTeamId: data.teamId as any,
                  timerEndTime: new Date(Date.now() + this.TIMER_DURATION * 1000)
              }, session);

              await session.commitTransaction();
          } catch (e) {
              await session.abortTransaction();
              throw new AppError('Transaction failed', 500);
          } finally {
              session.endSession();
          }

          await this.startTimer(auctionId, auction.currentPlayerId as unknown as string, this.TIMER_DURATION);

          getIo().to(`auction_${auctionId}`).emit('new_bid', {
              auctionId,
              playerId: auction.currentPlayerId,
              teamId: data.teamId,
              bidAmount: data.bidAmount,
              timerEndTime: new Date(Date.now() + this.TIMER_DURATION * 1000)
          });

          return newBid;

      } catch (err: any) {
          logger.error('Error placing bid', err);
          throw new AppError(err.message || 'Failed to place bid', 400);
      } finally {
          if (lock) {
              await lock.release();
          }
      }
  }

  private async startTimer(auctionId: string, playerId: string, durationInSeconds: number) {
      const timerKey = `timer:auction:${auctionId}:${playerId}`;

      // We floor to avoid floating ms issues
      const duration = Math.floor(durationInSeconds);

      await redisClient.set(timerKey, 'active', 'EX', duration);

      setTimeout(async () => {
         const isActive = await redisClient.get(timerKey);
         if (!isActive) {
             await this.finalizePlayer(auctionId, playerId);
         }
      }, duration * 1000 + 100);
  }

  private async finalizePlayer(auctionId: string, playerId: string) {
      const lockKey = `lock:auction:${auctionId}`;
      let lock;
      try {
          lock = await redlock.acquire([lockKey], 3000);
          const auction = await auctionRepository.getAuctionById(auctionId);
          if (!auction || auction.status !== 'live' || auction.currentPlayerId?.toString() !== playerId) {
              if (lock) await lock.release();
              return;
          }

          const session = await mongoose.startSession();
          session.startTransaction();

          try {
              if (auction.currentWinningTeamId && auction.currentBid) {
                  await auctionRepository.updateTeamPurse(
                      auctionId,
                      auction.currentWinningTeamId as unknown as string,
                      auction.currentBid,
                      playerId,
                      session
                  );

                  await auctionRepository.updatePlayerPool(auctionId, playerId, {
                      status: 'sold',
                      soldPrice: auction.currentBid,
                      soldToTeamId: auction.currentWinningTeamId
                  }, session);

                  getIo().to(`auction_${auctionId}`).emit('player_sold', {
                      playerId,
                      teamId: auction.currentWinningTeamId,
                      price: auction.currentBid
                  });
              } else {
                  await auctionRepository.updatePlayerPool(auctionId, playerId, {
                      status: 'unsold'
                  }, session);

                  getIo().to(`auction_${auctionId}`).emit('player_unsold', {
                      playerId
                  });
              }

              const upcomingPlayers = await auctionRepository.getUpcomingPlayers(auctionId);
              if (upcomingPlayers.length > 0) {
                  const nextPlayer = upcomingPlayers[0];
                  const newTimerEndTime = new Date(Date.now() + this.TIMER_DURATION * 1000);

                  await auctionRepository.updateAuction(auctionId, {
                      currentPlayerId: nextPlayer.playerId,
                      basePrice: nextPlayer.basePrice,
                      currentBid: 0,
                      currentWinningTeamId: null as any, // FIXED
                      timerEndTime: newTimerEndTime
                  }, session);

                  await session.commitTransaction();
                  await this.startTimer(auctionId, nextPlayer.playerId as unknown as string, this.TIMER_DURATION);

                  getIo().to(`auction_${auctionId}`).emit('next_player', {
                      playerId: nextPlayer.playerId,
                      basePrice: nextPlayer.basePrice,
                      timerEndTime: newTimerEndTime
                  });
              } else {
                  await auctionRepository.updateAuction(auctionId, {
                      status: 'completed',
                      currentPlayerId: null as any, // FIXED
                      timerEndTime: null as any
                  }, session);

                  await session.commitTransaction();
                  getIo().to(`auction_${auctionId}`).emit('auction_end', { auctionId });
              }

          } catch (e) {
             await session.abortTransaction();
             throw e;
          } finally {
             session.endSession();
          }

      } catch (e) {
          logger.error('Error finalizing player', e);
      } finally {
          if (lock) await lock.release();
      }
  }

  async getAuctionStatus(auctionId: string) {
      return auctionRepository.getAuctionById(auctionId);
  }

  async resumeActiveAuctions() {
      logger.info('Checking for active auctions to resume...');
      const liveAuctions = await Auction.find({ status: 'live' }).exec();

      for (const auction of liveAuctions) {
          if (auction.currentPlayerId && auction.timerEndTime) {
              const now = Date.now();
              const remainingMs = auction.timerEndTime.getTime() - now;

              if (remainingMs > 0) {
                  logger.info(`Resuming timer for auction ${auction._id}, player ${auction.currentPlayerId}, remaining: ${remainingMs}ms`);
                  await this.startTimer(auction._id as unknown as string, auction.currentPlayerId as unknown as string, remainingMs / 1000);
              } else {
                  // Timer expired while server was offline
                  logger.info(`Timer expired while offline for auction ${auction._id}, player ${auction.currentPlayerId}. Finalizing...`);
                  await this.finalizePlayer(auction._id as unknown as string, auction.currentPlayerId as unknown as string);
              }
          }
      }
  }
}

export const auctionService = new AuctionService();
