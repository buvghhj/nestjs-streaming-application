'use client'

import { Button } from "@/components/ui/common/Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/common/Form"
import { Input } from "@/components/ui/common/Input"
import { Separator } from "@/components/ui/common/Separator"
import { ConfirmModal } from "@/components/ui/elements/ConfirmModal"
import { FindSocialLinkQuery, useFindSocialLinkQuery, useRemoveSocialLinkMutation, useUpdateSocialLinkMutation } from "@/graphql/gennerated/output"
import { socialLinkSchema, TypeSocialLinkSchema } from "@/schemas/user/social-link.schema"
import { getSocialIcon } from "@/utils/get-social-icon"
import { DraggableProvided } from "@hello-pangea/dnd"
import { zodResolver } from "@hookform/resolvers/zod"
import { GripVertical, PencilIcon, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface SocialLinkItemProps {

    socialLink: FindSocialLinkQuery['findSocialLink'][0]

    provided: DraggableProvided

}

const SocialLinkItem = ({ socialLink, provided }: SocialLinkItemProps) => {

    const t = useTranslations('dashboard.settings.profile.socialLinks.editForm')

    const [editingId, setEditingId] = useState<string | null>(null)

    const { refetch } = useFindSocialLinkQuery()

    const form = useForm<TypeSocialLinkSchema>({

        resolver: zodResolver(socialLinkSchema),

        defaultValues: {

            title: socialLink.title!,
            url: socialLink.url!,

        }

    })

    const { isValid, isDirty } = form.formState

    const toggleEditing = (id: string | null) => {

        setEditingId(id)

    }

    const [update, { loading: isLoadingUpdate }] = useUpdateSocialLinkMutation({

        onCompleted() {

            toggleEditing(null)
            refetch()
            toast.success(t('successUpdateMessage'))

        },

        onError() {

            toast.error(t('errorUpdateMessage'))

        }

    })

    const [remove, { loading: isLoadingRemove }] = useRemoveSocialLinkMutation({

        onCompleted() {

            refetch()
            toast.success(t('successRemoveMessage'))

        },

        onError() {

            toast.error(t('errorRemoveMessage'))

        }

    })

    const onSubmit = (data: TypeSocialLinkSchema) => {

        update({

            variables: {

                id: socialLink?.id,
                data

            }

        })

    }

    const Icon = getSocialIcon(socialLink.url)

    return (

        <div
            className="mb-4 flex items-center gap-x-2 rounded-md border border-border bg-background text-sm"
            ref={provided.innerRef}
            {...provided.draggableProps}
        >
            <div className=" rounded-l-md border-r border-r-border px-2 py-9 text-foreground transition" {...provided.dragHandleProps}>

                <GripVertical className="size-5" />

            </div>

            <div className="space-y-1 px-2">

                {editingId === socialLink.id ?
                    (

                        <Form {...form}>

                            <form onSubmit={form.handleSubmit(onSubmit)} className='flex gap-x-6 '>

                                <div className="w-96 space-y-1">

                                    <FormField
                                        control={form.control}
                                        name='title'
                                        render={({ field }) => (

                                            <FormItem className="">

                                                <FormControl>

                                                    <Input
                                                        placeholder='Youtube'
                                                        disabled={isLoadingUpdate || isLoadingRemove}
                                                        {...field}
                                                    />

                                                </FormControl>

                                            </FormItem>

                                        )}
                                    />


                                    <FormField
                                        control={form.control}
                                        name='url'
                                        render={({ field }) => (

                                            <FormItem className="">

                                                <FormControl>

                                                    <Input
                                                        placeholder="https://youtube.com/buvhhj"
                                                        disabled={isLoadingUpdate || isLoadingRemove}
                                                        {...field}
                                                    />

                                                </FormControl>

                                            </FormItem>

                                        )}
                                    />

                                </div>

                                <div className="flex items-center gap-x-4">

                                    <Button onClick={() => toggleEditing(null)} variant='secondary'>{t('cancelButton')}</Button>

                                    <Button disabled={isLoadingUpdate || !isDirty || !isValid}  >{t('submitButton')}</Button>

                                </div>

                            </form>

                        </Form>
                    )
                    :
                    (
                        <>

                            <h2 className='flex items-center gap-2 text-[17px] font-semibold text-foreground'>

                                <Icon className="size-6" />

                                {socialLink.title}

                            </h2>

                            <p className='text-muted-foreground'>

                                {socialLink.url}

                            </p>

                        </>
                    )}

            </div>

            <div className="ml-auto flex items-center gap-x-2 pr-4">

                {editingId !== socialLink.id && (

                    <>

                        <Button onClick={() => toggleEditing(socialLink.id)} variant='ghost' size='lgIcon'>

                            <PencilIcon className="size-4 " />

                        </Button>

                    </>

                )}

                <Button onClick={() => remove({ variables: { id: socialLink.id } })} variant='ghost' size='lgIcon'>

                    <Trash2 className="size-4 " />

                </Button>


            </div>

        </div>

    )

}

export default SocialLinkItem