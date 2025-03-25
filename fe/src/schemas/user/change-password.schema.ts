import { z } from 'zod'

export const changePasswordSchema = z.object({

    oldPassword: z
        .string()
        .min(8),
    newPassword: z
        .string()
        .min(8),
    confirmNewPassword: z
        .string()
        .min(8),

}).refine((data) => data.newPassword === data.confirmNewPassword, {

    path: ["confirmNewPassword"]

})

export type TypeChangePasswordSchema = z.infer<typeof changePasswordSchema>

