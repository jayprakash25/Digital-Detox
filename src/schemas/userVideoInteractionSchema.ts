import { z } from 'zod';

export const userVideoInteractionSchema = z.object({
    id: z.string(),
    userId: z.string(),
    videoId: z.string(),
    watched: z.boolean(),
    isRelevant: z.boolean(),
})