'use client'

import { Form, FormField } from "@/components/ui/common/Form"
import { FindChannelByUsernameQuery, useChangeThumbnailMutation, useRemoveStreamThumbnailMutation } from "@/graphql/gennerated/output"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { TypeUploadFileSchema, uploadFileSchema } from "@/schemas/upload-file.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { ChangeEvent, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import Image from "next/image"
import { Card } from "@/components/ui/common/Card"
import ChannelAvatar from "@/components/ui/elements/ChannelAvatar"
import { Button } from "@/components/ui/common/Button"
import { ConfirmModal } from "@/components/ui/elements/ConfirmModal"
import { Trash } from "lucide-react"

interface ChangeThumbnailProps {
    stream: FindChannelByUsernameQuery['findChannelByUsername']['stream']
}

const ChangeThumbnailForm = ({ stream }: ChangeThumbnailProps) => {

    const t = useTranslations('stream.settings.thumbnail')

    const { user } = useCurrentUser()

    const inputRef = useRef<HTMLInputElement>(null)

    const form = useForm<TypeUploadFileSchema>({

        resolver: zodResolver(uploadFileSchema),

        values: {

            file: stream?.thumbnailUrl!

        }

    })

    const [update, { loading: isLoadingUpdate }] = useChangeThumbnailMutation({

        onCompleted() {

            toast.success(t('successUpdateMessage'))

            window.location.reload()

        },

        onError() {

            toast.error(t('errorUpdateMessage'))

        }

    })

    const [remove, { loading: isLoadingRemove }] = useRemoveStreamThumbnailMutation({

        onCompleted() {

            toast.success(t('successRemoveMessage'))

        },

        onError() {

            toast.error(t('errorRemoveMessage'))


        }

    })

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0]

        if (file) {

            form.setValue('file', file)

            update({ variables: { thumbnail: file } })

        }

    }

    return (

        <Form {...form}>

            <FormField
                control={form.control}
                name='file'
                render={({ field }) => (

                    <>

                        <div className='flex items-center space-x-6'>

                            {stream.thumbnailUrl ?
                                (

                                    <Image
                                        src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value!}
                                        alt={stream.title}
                                        width={190}
                                        height={80}
                                        className='aspect-video rounded-lg'
                                    />
                                )
                                :
                                (
                                    <Card className='flex h-28 w-full flex-col items-center justify-center rounded-lg'>

                                        <ChannelAvatar channel={user!} />

                                    </Card>

                                )
                            }

                            <div className='flex w-full items-center gap-x-3'>

                                <input className='hidden' type='file' ref={inputRef} onChange={handleImageChange} />

                                <Button
                                    variant='secondary'
                                    onClick={() => inputRef.current?.click()}
                                    disabled={isLoadingUpdate || isLoadingRemove}
                                >
                                    {t('updateButton')}
                                </Button>

                                {stream.thumbnailUrl && (

                                    <ConfirmModal
                                        heading={t('confirmModal.heading')}
                                        message={t('confirmModal.message')}
                                        onConfirm={() => remove()}
                                    >

                                        <Button
                                            variant='ghost'
                                            size='lgIcon'
                                            disabled={isLoadingUpdate || isLoadingRemove}
                                        >

                                            <Trash className='size-4' />

                                        </Button>

                                    </ConfirmModal>

                                )}

                            </div>

                        </div>

                        <p className='text-sm text-muted-foreground'>

                            {t('info')}

                        </p>

                    </>

                )}

            />

        </Form>

    )

}

export default ChangeThumbnailForm