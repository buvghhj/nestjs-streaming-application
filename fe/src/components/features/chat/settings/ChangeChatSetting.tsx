'use client'

import { Form, FormField } from "@/components/ui/common/Form"
import { Heading } from "@/components/ui/elements/Heading"
import ToggleCard, { ToggleCardSkeleton } from "@/components/ui/elements/ToggleCard"
import { useChangeChatSettingsMutation } from "@/graphql/gennerated/output"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { changeChatSettingsSchema, TypeChangeChatSettingSchema } from "@/schemas/chat/change-chat-settings.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const ChangeChatSetting = () => {

    const t = useTranslations('dashboard.chat')

    const { user, isLoadingProfile } = useCurrentUser()

    const form = useForm<TypeChangeChatSettingSchema>({

        resolver: zodResolver(changeChatSettingsSchema),

        values: {

            isChatEnabled: user?.stream.isChatEnabled ?? false,

            isChatFollowersOnly: user?.stream.isChatFollowersOnly ?? false,

            isChatPremiumFollowersOnly: user?.stream.isChatPremiumFollowersOnly ?? false

        }

    })

    const [updateChatSettings, { loading: isLoadingChatSettings }] = useChangeChatSettingsMutation({

        onCompleted(data) {

            toast.success(t('successMessage'))

        },

        onError() {

            toast.error(t('errorMessage'))

        }

    })

    const onChange = (field: keyof TypeChangeChatSettingSchema, value: boolean) => {

        form.setValue(field, value)

        updateChatSettings({

            variables: {

                data: { ...form.getValues(), [field]: value }

            }

        })

    }

    return (

        <div className="lg:px-10">

            <Heading title={t('header.heading')} description={t('header.description')} size='lg' />

            <div className="mt-3 space-y-6">

                {isLoadingProfile ?
                    (

                        Array.from({ length: 3 }).map((_, index) => (

                            <ToggleCardSkeleton key={index} />

                        ))

                    )
                    :
                    (
                        <>

                            <Form {...form}>

                                <FormField
                                    control={form.control}
                                    name='isChatEnabled'
                                    render={({ field }) => (

                                        <ToggleCard
                                            heading={t('isChatEnabled.heading')}
                                            description={t('isChatEnabled.description')}
                                            value={field.value}
                                            isDisabled={isLoadingChatSettings}
                                            onChange={value => onChange('isChatEnabled', value)}
                                        />

                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='isChatFollowersOnly'
                                    render={({ field }) => (

                                        <ToggleCard
                                            heading={t('isChatFollowersOnly.heading')}
                                            description={t('isChatFollowersOnly.description')}
                                            isDisabled={isLoadingChatSettings}
                                            value={field.value}
                                            onChange={value => onChange('isChatFollowersOnly', value)}
                                        />

                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='isChatPremiumFollowersOnly'
                                    render={({ field }) => (

                                        <ToggleCard
                                            heading={t('isChatPremiumFollowersOnly.heading')}
                                            description={t('isChatPremiumFollowersOnly.description')}
                                            isDisabled={isLoadingChatSettings || !user?.isVerified}
                                            value={field.value}
                                            onChange={value => onChange('isChatPremiumFollowersOnly', value)}
                                        />

                                    )}
                                />

                            </Form>

                        </>
                    )}


            </div>
        </div>

    )

}

export default ChangeChatSetting