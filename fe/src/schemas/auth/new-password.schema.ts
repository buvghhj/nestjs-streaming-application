import { z } from 'zod'

export const newPasswordSchema = z.object({

    password: z
        .string()
        .min(8),
    confirmPassword: z
        .string()
        .min(8)
}).refine(data => data.password === data.confirmPassword, {

    path: ['confirmPassword']

})

export type TypeNewPasswordSchema = z.infer<typeof newPasswordSchema>

