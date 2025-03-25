'use client'

import { useResetPasswordMutation } from "@/graphql/gennerated/output"
import { resetPasswordSchema, TypeResetPasswordSchema } from "@/schemas/auth/reset-password.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { AuthWrapper } from "../AuthWrapper"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/common/Alert"
import { CircleCheck } from "lucide-react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/common/Form"
import { Input } from "@/components/ui/common/Input"
import { Button } from "@/components/ui/common/Button"

const ResetPasswordForm = () => {

    const t = useTranslations('auth.resetPassword')

    const [isSuccess, setIsSuccess] = useState(false)

    const form = useForm<TypeResetPasswordSchema>({

        resolver: zodResolver(resetPasswordSchema),

        defaultValues: {

            email: '',

        }

    })

    const [resetPassword, { loading: isLoadingResetPassword }] = useResetPasswordMutation({

        onCompleted() {

            setIsSuccess(true)

        },

        onError() {

            toast.error(t('errorMessage'))

        }

    })

    const { isValid } = form.formState

    const onSubmit = (data: TypeResetPasswordSchema) => {

        resetPassword({

            variables: {

                data

            }

        })

    }

    return (

        <AuthWrapper
            heading={t('heading')}
            backButtonLabel={t('backButtonLabel')}
            backButtonHref='/account/login'
        >

            {isSuccess ? (

                <div>

                    <Alert>

                        <CircleCheck className='size-4' />

                        <AlertTitle>

                            {t('successAlertTitle')}

                        </AlertTitle>

                        <AlertDescription>

                            {t('successAlertDescription')}

                        </AlertDescription>

                    </Alert>

                </div>

            )
                :
                (
                    <>

                        <Form {...form}>

                            <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-y-3'>

                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (

                                        <FormItem>

                                            <FormLabel>{t('emailLabel')} </FormLabel>

                                            <FormControl>

                                                <Input
                                                    placeholder='john.doe@example.com'
                                                    disabled={isLoadingResetPassword}
                                                    {...field}
                                                />

                                            </FormControl>

                                            <FormDescription>{t('emailDescription')}</FormDescription>

                                        </FormItem>

                                    )}
                                />


                                <Button className='mt-2 w-full' disabled={!isValid || isLoadingResetPassword}> {t('submitButton')}</Button>

                            </form>

                        </Form>

                    </>
                )
            }

        </AuthWrapper>


    )

}

export default ResetPasswordForm