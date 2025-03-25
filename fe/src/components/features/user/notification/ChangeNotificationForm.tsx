'use client'

import { ChannelItemSkeleton } from "@/components/layout/sidebar/ChannelItem"
import { Form, FormField } from "@/components/ui/common/Form"
import ToggleCard, { ToggleCardSkeleton } from "@/components/ui/elements/ToggleCard"
import { useChangeNotificationSettingsMutation } from "@/graphql/gennerated/output"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { changeNotificationSettingsSchema, TypeChangeNotificationSettingSchema } from "@/schemas/user/change-notification-settings.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const ChangeNotificationForm = () => {

    const t = useTranslations('dashboard.settings.notifications')

    const { user, isLoadingProfile, refetch } = useCurrentUser()

    const form = useForm<TypeChangeNotificationSettingSchema>({

        resolver: zodResolver(changeNotificationSettingsSchema),

        values: {

            siteNotifications: user?.notificationSettings?.siteNotifications ?? false,

            telegramNotifications: user?.notificationSettings?.telegramNotifications ?? false

        }

    })

    const [updateNotificationSettings, { loading: isNotificationSettings }] = useChangeNotificationSettingsMutation({

        onCompleted(data) {

            refetch()

            toast.success(t('successMessage'))

            if (data.changeNotificationSettings.telegramAuthToken) {

                window.open(`https://t.me/tanstream_bot?start=${data.changeNotificationSettings.telegramAuthToken}`, '_blank')

            }

        },

        onError() {

            toast.error(t('errorMessage'))

        }

    })

    const onChange = (field: keyof TypeChangeNotificationSettingSchema, value: boolean) => {

        form.setValue(field, value)

        updateNotificationSettings({

            variables: {

                data: { ...form.getValues(), [field]: value }

            }

        })

    }

    return (

        <>

            {isLoadingProfile ?
                (
                    Array.from({ length: 2 }).map((_, index) => (

                        <ToggleCardSkeleton key={index} />

                    ))
                )
                :
                (
                    <>

                        <Form {...form}>

                            <FormField
                                control={form.control}
                                name='siteNotifications'
                                render={({ field }) => (

                                    <ToggleCard
                                        heading={t('siteNotifications.heading')}
                                        description={t('siteNotifications.description')}
                                        value={field.value}
                                        isDisabled={isNotificationSettings}
                                        onChange={value => onChange('siteNotifications', value)}
                                    />

                                )}
                            />

                            <FormField
                                control={form.control}
                                name='telegramNotifications'
                                render={({ field }) => (

                                    <ToggleCard
                                        heading={t('telegramNotifications.heading')}
                                        description={t('telegramNotifications.description')}
                                        isDisabled={isNotificationSettings}
                                        value={field.value}
                                        onChange={value => onChange('telegramNotifications', value)}
                                    />

                                )}
                            />


                        </Form>

                    </>
                )
            }

        </>

    )

}

export default ChangeNotificationForm