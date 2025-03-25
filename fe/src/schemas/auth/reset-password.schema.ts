import { z } from 'zod'

export const resetPasswordSchema = z.object({

    email: z.string()

})

export type TypeResetPasswordSchema = z.infer<typeof resetPasswordSchema>

