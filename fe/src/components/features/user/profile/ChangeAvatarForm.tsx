'use client'

import { Button } from "@/components/ui/common/Button"
import { Form, FormField } from "@/components/ui/common/Form"
import { Skeleton } from "@/components/ui/common/Skeleton"
import ChannelAvatar from "@/components/ui/elements/ChannelAvatar"
import { ConfirmModal } from "@/components/ui/elements/ConfirmModal"
import FormWrapper from "@/components/ui/elements/FormWrapper"
import { useChangeProfileAvatarMutation, useRemoveProfileAvatarMutation } from "@/graphql/gennerated/output"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { TypeUploadFileSchema, uploadFileSchema } from "@/schemas/upload-file.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Trash } from "lucide-react"
import { useTranslations } from "next-intl"
import { ChangeEvent, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const ChangeAvatarForm = () => {

    const t = useTranslations('dashboard.settings.profile.avatar')

    const { user, isLoadingProfile, refetch } = useCurrentUser()

    const inputRef = useRef<HTMLInputElement>(null)

    const form = useForm<TypeUploadFileSchema>({

        resolver: zodResolver(uploadFileSchema),
        values: {

            file: user?.avatar || ''

        }

    })

    const [update, { loading: isLoadingAvatar }] = useChangeProfileAvatarMutation({

        onCompleted() {

            refetch()

            toast.success(t('successUpdateMessage'))

            window.location.reload()

        },

        onError() {

            toast.error(t('errorUpdateMessage'))


        }

    })


    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0]

        if (file) {

            form.setValue('file', file)
            update({ variables: { avatar: file } })
        }

    }


    const [remove, { loading: isLoadingRemove }] = useRemoveProfileAvatarMutation({

        onCompleted() {

            refetch()
            toast.success(t('successRemoveMessage'))

        },

        onError() {

            toast.error(t('errorRemoveMessage'))

        }

    })


    return (

        isLoadingProfile ?

            (
                <>

                    <ChangeAvatarFormSkeleton />

                </>
            )
            :
            (

                <FormWrapper heading={t('heading')}>

                    <Form {...form}>

                        <FormField control={form.control} name='file' render={({ field }) =>

                        (<div className="pb-5 mt-3">

                            <div className="w-full items-center space-x-6 lg:flex">

                                <ChannelAvatar
                                    channel={{
                                        username: user?.username!,
                                        avatar: field.value instanceof File
                                            ?
                                            URL.createObjectURL(field.value)
                                            :
                                            field.value
                                    }}
                                    size='xl'
                                />

                                <div className="space-y-4">

                                    <div className="flex items-center gap-x-3">

                                        <input className="hidden" type="file" ref={inputRef} onChange={handleAvatarChange} />

                                        <Button variant='secondary' onClick={() => inputRef.current?.click()} disabled={isLoadingAvatar || isLoadingRemove}>

                                            {t('updateButton')}

                                        </Button>

                                        {user?.avatar && (

                                            <ConfirmModal
                                                heading={t('confirmModal.heading')}
                                                message={t('confirmModal.message')}
                                                onConfirm={() => remove()}
                                            >

                                                <Button variant='ghost' size='lgIcon' disabled={
                                                    isLoadingAvatar || isLoadingRemove}>

                                                    <Trash className="size-3" />

                                                </Button>

                                            </ConfirmModal>

                                        )}

                                    </div>

                                    <p className="text-sm text-muted-foreground">{t('info')}</p>

                                </div>

                            </div>

                        </div>)

                        } />

                    </Form>

                </FormWrapper>

            )

    )

}

export default ChangeAvatarForm

export const ChangeAvatarFormSkeleton = () => {

    return <Skeleton className="h-52 w-full" />

}