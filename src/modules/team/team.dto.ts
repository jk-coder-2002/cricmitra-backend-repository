import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z.string().min(3),
  shortName: z.string().min(2).max(5),
  captainId: z.string()
});
