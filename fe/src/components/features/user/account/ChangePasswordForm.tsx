'use client'

import { Button } from "@/components/ui/common/Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/common/Form"
import { Input } from "@/components/ui/common/Input"
import { Separator } from "@/components/ui/common/Separator"
import { Skeleton } from "@/components/ui/common/Skeleton"
import FormWrapper from "@/components/ui/elements/FormWrapper"
import { useChangePasswordMutation } from "@/graphql/gennerated/output"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { changePasswordSchema, TypeChangePasswordSchema } from "@/schemas/user/change-password.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const ChangePasswordForm = () => {

    const t = useTranslations('dashboard.settings.account.password')

    const { refetch } = useCurrentUser()

    const form = useForm<TypeChangePasswordSchema>({

        resolver: zodResolver(changePasswordSchema),

        values: {

            oldPassword: '',
            newPassword: '',
            confirmNewPassword: ''

        }

    })

    const [changePassword, { loading: isLoadingPassword }] = useChangePasswordMutation({

        onCompleted() {

            refetch()

            form.reset()

            toast.success(t('successMessage'))

        },

        onError(changePassword) {

            toast.error(changePassword.message)

        }

    })

    const { isValid } = form.formState

    const onSubmit = (data: TypeChangePasswordSchema) => {

        changePassword({

            variables: {

                data

            }

        })

    }

    return (

        <FormWrapper heading={t('heading')}>

            <Form {...form}>

                <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-y-3 mt-3'>

                    <FormField
                        control={form.control}
                        name='oldPassword'
                        render={({ field }) => (

                            <FormItem className="">

                                <FormLabel>{t('oldPasswordLabel')} </FormLabel>

                                <FormControl>

                                    <Input
                                        placeholder="********"
                                        type="password"
                                        disabled={isLoadingPassword}
                                        {...field}
                                    />

                                </FormControl>

                                <FormDescription>{t('oldPasswordDescription')}</FormDescription>

                            </FormItem>

                        )}
                    />

                    <Separator />

                    <FormField
                        control={form.control}
                        name='newPassword'
                        render={({ field }) => (

                            <FormItem className="">

                                <FormLabel>{t('newPasswordLabel')} </FormLabel>

                                <FormControl>

                                    <Input
                                        placeholder="********"
                                        disabled={isLoadingPassword}
                                        type="password"
                                        {...field}
                                    />

                                </FormControl>

                                <FormDescription>{t('newPasswordDescription')}</FormDescription>

                            </FormItem>

                        )}
                    />

                    <Separator />

                    <FormField
                        control={form.control}
                        name='confirmNewPassword'
                        render={({ field }) => (

                            <FormItem className="">

                                <FormLabel>{t('confirmNewPasswordLabel')} </FormLabel>

                                <FormControl>

                                    <Input
                                        placeholder="********"
                                        disabled={isLoadingPassword}
                                        type="password"
                                        {...field}
                                    />

                                </FormControl>

                                <FormDescription>{t('confirmNewPasswordDescription')}</FormDescription>

                            </FormItem>

                        )}
                    />

                    <Separator />

                    <div className="flex justify-end p-5">

                        <Button className="" disabled={!isValid || isLoadingPassword}>{t('submitButton')}</Button>

                    </div>

                </form>

            </Form>

        </FormWrapper>

    )

}

export default ChangePasswordForm

export const ChangePasswordSkeleton = () => {

    return <Skeleton className="h-64 w-full" />

}