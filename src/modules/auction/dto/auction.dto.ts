import { z } from 'zod';

export const createAuctionSchema = z.object({
  name: z.string().min(3),
  tournamentId: z.string().optional(),
  bidIncrement: z.number().positive().default(100000)
});

export const addPlayerToPoolSchema = z.object({
  playerId: z.string(),
  basePrice: z.number().positive()
});

export const placeBidSchema = z.object({
  teamId: z.string(),
  bidAmount: z.number().positive()
});

export const addTeamToAuctionSchema = z.object({
    teamId: z.string(),
    purse: z.number().positive(),
    maxPlayersLimit: z.number().positive().default(25)
});
