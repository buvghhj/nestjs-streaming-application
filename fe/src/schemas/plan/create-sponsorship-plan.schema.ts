import { z } from 'zod'

export const createSponsorshipPlanSchema = z.object({

    title: z
        .string().min(1),
    description: z
        .string().optional(),
    price: z
        .coerce.number().positive()

})

export type TypeCreateSponsorshipPlanchema = z.infer<typeof createSponsorshipPlanSchema>

