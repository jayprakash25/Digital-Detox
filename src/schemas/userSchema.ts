import {z} from 'zod';

export const userSchema = z.object({
    id: z.string(),
    googleId: z.string(),
    name: z.string(),
    email: z.string(),
    picture: z.string(),
    interests: z.array(z.string()),
    createdAt: z.string(),
    updatedAt: z.string(),
    });