'use client'

import { Button } from "@/components/ui/common/Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/common/Form"
import { Input } from "@/components/ui/common/Input"
import { Separator } from "@/components/ui/common/Separator"
import { Skeleton } from "@/components/ui/common/Skeleton"
import FormWrapper from "@/components/ui/elements/FormWrapper"
import { useCreateSocialLinkMutation, useFindSocialLinkQuery } from "@/graphql/gennerated/output"
import { socialLinkSchema, TypeSocialLinkSchema } from "@/schemas/user/social-link.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import SocialLinkList from "./SocialLinkList"

const SocialLinkForm = () => {

    const t = useTranslations('dashboard.settings.profile.socialLinks.createForm')

    const { loading: isLoadingLink, refetch } = useFindSocialLinkQuery({})

    const form = useForm<TypeSocialLinkSchema>({

        resolver: zodResolver(socialLinkSchema),

        defaultValues: {

            title: '',
            url: '',

        }

    })

    const [createSocialLink, { loading: isLoadingCreate }] = useCreateSocialLinkMutation({

        onCompleted() {

            form.reset()

            refetch()

            toast.success(t('successMessage'))

        },

        onError() {

            toast.error(t('errorMessage'))

        }

    })

    const { isValid } = form.formState

    const onSubmit = (data: TypeSocialLinkSchema) => {

        createSocialLink({

            variables: {

                data

            }

        })

    }


    return (

        <>

            {
                isLoadingLink ?
                    (
                        <>

                            <SocialLinkFormSkeleton />

                        </>
                    )
                    :
                    (
                        <>

                            <FormWrapper heading={t('heading')}>

                                <Form {...form}>

                                    <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-y-3 mt-3'>

                                        <FormField
                                            control={form.control}
                                            name='title'
                                            render={({ field }) => (

                                                <FormItem className="">

                                                    <FormLabel>{t('titleLabel')} </FormLabel>

                                                    <FormControl>

                                                        <Input
                                                            placeholder={t('titlePlaceholder')}
                                                            disabled={isLoadingCreate}
                                                            {...field}
                                                        />

                                                    </FormControl>

                                                    <FormDescription>{t('titleDescription')}</FormDescription>

                                                </FormItem>

                                            )}
                                        />

                                        <Separator />

                                        <FormField
                                            control={form.control}
                                            name='url'
                                            render={({ field }) => (

                                                <FormItem className="">

                                                    <FormLabel>{t('urlLabel')} </FormLabel>

                                                    <FormControl>

                                                        <Input
                                                            placeholder={t('urlPlaceholder')}
                                                            disabled={isLoadingCreate}
                                                            {...field}
                                                        />

                                                    </FormControl>

                                                    <FormDescription>{t('urlDescription')}</FormDescription>

                                                </FormItem>

                                            )}
                                        />



                                        <Separator />

                                        <div className="flex justify-end p-5">

                                            <Button className="" disabled={!isValid || isLoadingCreate}>{t('submitButton')}</Button>

                                        </div>

                                    </form>

                                </Form>

                                <SocialLinkList />

                            </FormWrapper>

                        </>
                    )
            }

        </>

    )

}

export default SocialLinkForm

export const SocialLinkFormSkeleton = () => {

    return <Skeleton className="h-72 w-full" />

}