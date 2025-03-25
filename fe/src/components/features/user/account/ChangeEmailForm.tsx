'use client'

import { Button } from "@/components/ui/common/Button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/common/Form"
import { Input } from "@/components/ui/common/Input"
import { Separator } from "@/components/ui/common/Separator"
import { Skeleton } from "@/components/ui/common/Skeleton"
import FormWrapper from "@/components/ui/elements/FormWrapper"
import { useChangeEmailMutation } from "@/graphql/gennerated/output"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { changeEmailSchema, TypeChangeEmailSchema } from "@/schemas/user/change-email.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const ChangeEmailForm = () => {

    const t = useTranslations('dashboard.settings.account.email')

    const { user, isLoadingProfile, refetch } = useCurrentUser()

    const form = useForm<TypeChangeEmailSchema>({

        resolver: zodResolver(changeEmailSchema),

        values: {

            email: user?.email ?? '',

        }

    })

    const [changeEmail, { loading: isLoadingEmail }] = useChangeEmailMutation({

        onCompleted() {

            refetch()
            toast.success(t('successMessage'))

        },

        onError() {

            toast.error(t('errorMessage'))

        }

    })

    const { isValid, isDirty } = form.formState

    const onSubmit = (data: TypeChangeEmailSchema) => {

        changeEmail({

            variables: {

                data

            }

        })

    }

    return (

        <>

            {isLoadingProfile ?
                (
                    <>

                        <ChangeEmailFormSkeleton />

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
                                        name='email'
                                        render={({ field }) => (

                                            <FormItem className="">

                                                <FormLabel>{t('emailLabel')} </FormLabel>

                                                <FormControl>

                                                    <Input
                                                        placeholder="john.doe@example.com"
                                                        disabled={isLoadingEmail}
                                                        {...field}
                                                    />

                                                </FormControl>

                                                <FormDescription>{t('emailDescription')}</FormDescription>

                                            </FormItem>

                                        )}
                                    />

                                    <Separator />

                                    <div className="flex justify-end p-5">

                                        <Button className="" disabled={!isValid || !isDirty || isLoadingEmail}>{t('submitButton')}</Button>

                                    </div>

                                </form>

                            </Form>

                        </FormWrapper>

                    </>
                )}

        </>

    )

}

export default ChangeEmailForm

export const ChangeEmailFormSkeleton = () => {

    return <Skeleton className="h-64 w-full" />

}