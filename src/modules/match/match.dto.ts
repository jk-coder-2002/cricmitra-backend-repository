import { z } from 'zod';

export const createMatchSchema = z.object({
  teamAId: z.string(),
  teamBId: z.string(),
  venue: z.string().min(3),
  matchDate: z.string().datetime(),
  overs: z.number().positive().max(50),
  tournamentId: z.string().optional(),
  scorerId: z.string().optional()
});

export const updateTossSchema = z.object({
  wonBy: z.string(),
  decision: z.enum(['bat', 'bowl'])
});
