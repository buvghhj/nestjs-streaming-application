import { z } from 'zod'

export const changeNotificationSettingsSchema = z.object({

    siteNotifications: z
        .boolean(),
    telegramNotifications: z
        .boolean()

})

export type TypeChangeNotificationSettingSchema = z.infer<typeof changeNotificationSettingsSchema>

