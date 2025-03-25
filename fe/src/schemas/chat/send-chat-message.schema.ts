import { z } from 'zod'

export const sendChatMessageSchema = z.object({

    text: z.string().min(1)

})

export type TypeSendChatMessageSchema = z.infer<typeof sendChatMessageSchema>

