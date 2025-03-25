import { z } from 'zod'

export const deactivateSchema = z.object({

    email: z
        .string()
        .email()
        .min(3),
    password: z
        .string()
        .min(8),
    token: z
        .string()
        .optional(),

})

export type TypeDeactivateSchema = z.infer<typeof deactivateSchema>

