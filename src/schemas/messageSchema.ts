import {z} from 'zod';

export const messageSchema = z.object({
    content:z.string().min(10,{message:"Message should be at least 10 characters"})
    .max(300,{message:"Message no longer than 300"})
})