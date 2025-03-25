'use client'

import { Button } from "@/components/ui/common/Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/common/Form"
import { Input } from "@/components/ui/common/Input"
import { Separator } from "@/components/ui/common/Separator"
import { Skeleton } from "@/components/ui/common/Skeleton"
import { Textarea } from "@/components/ui/common/Textarea"
import FormWrapper from "@/components/ui/elements/FormWrapper"
import { useChangeProfileInfoMutation } from "@/graphql/gennerated/output"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { changeInfoSchema, TypeChangeInfoSchema } from "@/schemas/user/change-infor.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const ChangeInfoForm = () => {

    const t = useTranslations('dashboard.settings.profile.info')

    const { user, isLoadingProfile, refetch } = useCurrentUser()

    const form = useForm<TypeChangeInfoSchema>({

        resolver: zodResolver(changeInfoSchema),

        values: {

            username: user?.username ?? '',
            displayName: user?.displayName ?? '',
            bio: user?.bio ?? ''

        }

    })

    const [updateInfo, { loading: isLoadingInfo }] = useChangeProfileInfoMutation({

        onCompleted() {

            refetch()
            toast.success(t('successMessage'))

        },

        onError() {

            toast.error(t('errorMessage'))

        }

    })

    const { isValid, isDirty } = form.formState

    const onSubmit = (data: TypeChangeInfoSchema) => {

        updateInfo({

            variables: {

                data

            }

        })

    }

    return (

        <>
            {isLoadingProfile ?
                (

                    <ChangeInfoFormSkeleton />

                )
                :
                (
                    <FormWrapper heading={t('heading')}>

                        <Form {...form}>

                            <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-y-3 mt-3'>

                                <FormField
                                    control={form.control}
                                    name='username'
                                    render={({ field }) => (

                                        <FormItem className="">

                                            <FormLabel>{t('usernameLabel')} </FormLabel>

                                            <FormControl>

                                                <Input
                                                    placeholder={t('usernamePlaceholder')}
                                                    disabled={isLoadingInfo}
                                                    {...field}
                                                />

                                            </FormControl>

                                            <FormDescription>{t('usernameDescription')}</FormDescription>

                                        </FormItem>

                                    )}
                                />

                                <Separator />

                                <FormField
                                    control={form.control}
                                    name='displayName'
                                    render={({ field }) => (

                                        <FormItem className="">

                                            <FormLabel>{t('displayNameLabel')} </FormLabel>

                                            <FormControl>

                                                <Input
                                                    placeholder={t('displayNamePlaceholder')}
                                                    disabled={isLoadingInfo}
                                                    {...field}
                                                />

                                            </FormControl>

                                            <FormDescription>{t('displayNameDescription')}</FormDescription>

                                        </FormItem>

                                    )}
                                />

                                <Separator />

                                <FormField
                                    control={form.control}
                                    name='bio'
                                    render={({ field }) => (

                                        <FormItem className="">

                                            <FormLabel>{t('bioLabel')} </FormLabel>

                                            <FormControl>

                                                <Textarea
                                                    placeholder={t('bioPlaceholder')}
                                                    disabled={isLoadingInfo}
                                                    {...field}
                                                />

                                            </FormControl>

                                            <FormDescription>{t('bioDescription')}</FormDescription>

                                        </FormItem>

                                    )}
                                />

                                <Separator />

                                <div className="flex justify-end p-5">

                                    <Button className="" disabled={!isValid || !isDirty || isLoadingInfo}>{t('submitButton')}</Button>

                                </div>

                            </form>

                        </Form>

                    </FormWrapper>
                )}

        </>
    )

}

export default ChangeInfoForm


export const ChangeInfoFormSkeleton = () => {

    return <Skeleton className="h-96 w-full" />

}