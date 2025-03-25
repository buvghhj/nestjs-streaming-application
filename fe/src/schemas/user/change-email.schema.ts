import { z } from 'zod'

export const changeEmailSchema = z.object({

    email: z
        .string()
        .email()
        .min(3),

})

export type TypeChangeEmailSchema = z.infer<typeof changeEmailSchema>

