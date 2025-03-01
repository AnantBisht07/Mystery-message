import { z } from 'zod'


export const messageSchema = z.object({
    _id: z.string(),
    content: z
    .string()
    .min(10, {message: 'Content must be atleast of 10 characters'})
    .max(400, {message: 'Content must not be longer than 400 characters'})
})