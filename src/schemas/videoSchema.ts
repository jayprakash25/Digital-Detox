import {z} from 'zod';

export const videoSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    thumbnail: z.string(),
    channelId: z.string(),
    channelTitle: z.string(),
    publishedAt: z.string(),
    interests: z.array(z.string()),
    });

    