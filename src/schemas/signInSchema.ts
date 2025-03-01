import { z } from 'zod'


export const signInSchema = z.object({
    // identifier is same as email/username it is commonly used in production thats why i wrote here 
    identifier: z.string(),
    password: z.string(),
})