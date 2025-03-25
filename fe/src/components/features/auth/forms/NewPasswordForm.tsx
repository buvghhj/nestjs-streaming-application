'use client'

import { useNewPasswordMutation } from "@/graphql/gennerated/output"
import { newPasswordSchema, TypeNewPasswordSchema } from "@/schemas/auth/new-password.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { AuthWrapper } from "../AuthWrapper"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/common/Form"
import { Button } from "@/components/ui/common/Button"
import { Input } from "@/components/ui/common/Input"

const NewPasswordForm = () => {

    const t = useTranslations('auth.newPassword')

    const router = useRouter()

    const params = useParams<{ token: string }>()

    const form = useForm<TypeNewPasswordSchema>({

        resolver: zodResolver(newPasswordSchema),

        defaultValues: {

            password: '',
            confirmPassword: '',

        }

    })

    const [newPassword, { loading: isLoadingNewPassword }] = useNewPasswordMutation({

        onCompleted() {

            toast.success(t('successMessage'))

            router.push('/account/login')

        },

        onError() {

            toast.error(t('errorMessage'))

        }

    })

    const { isValid } = form.formState

    const onSubmit = (data: TypeNewPasswordSchema) => {

        newPassword({

            variables: {

                data: {

                    ...data,
                    token: params.token

                }

            }

        })

    }

    return (


        <AuthWrapper
            heading={t('heading')}
            backButtonLabel={t('backButtonLabel')}
            backButtonHref='/account/create'
        >

            <Form {...form}>

                <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-y-3'>

                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>{t('passwordLabel')} </FormLabel>

                                <FormControl>

                                    <Input
                                        placeholder='********'
                                        type='password'
                                        disabled={isLoadingNewPassword}
                                        {...field}
                                    />

                                </FormControl>

                                <FormDescription> {t('passwordDescription')}</FormDescription>

                            </FormItem>

                        )}
                    />

                    <FormField
                        control={form.control}
                        name='confirmPassword'
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>{t('passwordRepeatLabel')}</FormLabel>

                                <FormControl>

                                    <Input
                                        placeholder='********'
                                        type='password'
                                        disabled={isLoadingNewPassword}
                                        {...field}
                                    />

                                </FormControl>

                                <FormDescription> {t('passwordRepeatDescription')} </FormDescription>

                            </FormItem>

                        )}
                    />

                    <Button className='mt-2 w-full' disabled={!isValid || isLoadingNewPassword}> {t('submitButton')}</Button>

                </form>

            </Form>

        </AuthWrapper>


    )

}

export default NewPasswordForm