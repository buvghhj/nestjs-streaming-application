import { z } from 'zod'

export const socialLinkSchema = z.object({

    title: z
        .string(),
    url: z
        .string()
        .url()
})

export type TypeSocialLinkSchema = z.infer<typeof socialLinkSchema>

