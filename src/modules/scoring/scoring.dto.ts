import { z } from 'zod';

export const addBallSchema = z.object({
  inningsId: z.string(),
  overNumber: z.number().min(1),
  ballNumber: z.number().min(1),
  bowlerId: z.string(),
  batsmanId: z.string(),
  nonStrikerId: z.string(),
  runsBat: z.number().min(0).max(6),
  extras: z.object({
    type: z.enum(['wide', 'noBall', 'legBye', 'bye', 'penalty', 'none']),
    runs: z.number().min(0)
  }),
  isWicket: z.boolean().default(false),
  wicketType: z.enum(['bowled', 'caught', 'lbw', 'runOut', 'stumped', 'hitWicket', 'obstructingTheField', 'retiredHurt']).optional(),
  playerOutId: z.string().optional(),
  fielderId: z.string().optional()
});
