'use client'

import { Button } from "@/components/ui/common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/common/Dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/common/Form"
import { Input } from "@/components/ui/common/Input"
import { Textarea } from "@/components/ui/common/Textarea"
import { useCreateSponsorshipPlanMutation } from "@/graphql/gennerated/output"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { createSponsorshipPlanSchema, TypeCreateSponsorshipPlanchema } from "@/schemas/plan/create-sponsorship-plan.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface CreatePlanFormProps {
    refetchPlan: any
}

const CreatePlanForm = ({ refetchPlan }: CreatePlanFormProps) => {

    const t = useTranslations('dashboard.plans.createForm')

    const [isOpen, setIsOpen] = useState(false)

    const { refetch } = useCurrentUser()

    const form = useForm<TypeCreateSponsorshipPlanchema>({

        resolver: zodResolver(createSponsorshipPlanSchema),

        values: {

            title: '',

            description: '',

            price: 0

        }

    })

    const { isValid } = form.formState

    const [create, { loading: isLoadingCreate }] = useCreateSponsorshipPlanMutation({

        onCompleted() {

            setIsOpen(false)
            form.reset()
            refetchPlan()
            toast.success(t('successMessage'))

        },

        onError() {

            toast.error(t('errorMessage'))

        }

    })

    const onSubmit = (data: TypeCreateSponsorshipPlanchema) => {

        create({

            variables: {

                data

            }

        })

    }

    return (

        <Dialog open={isOpen} onOpenChange={setIsOpen}>

            <DialogTrigger asChild>

                <Button>{t('trigger')}</Button>

            </DialogTrigger>

            <DialogContent>

                <DialogHeader>

                    <DialogTitle>{t('heading')}</DialogTitle>

                </DialogHeader>

                <Form {...form}>


                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (

                                <FormItem>

                                    <FormLabel>{t('titleLabel')}</FormLabel>

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

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (

                                <FormItem>

                                    <FormLabel>{t('descriptionLabel')}</FormLabel>

                                    <FormControl>

                                        <Textarea
                                            placeholder={t('descriptionPlaceholder')}
                                            disabled={isLoadingCreate}
                                            {...field}
                                        />

                                    </FormControl>

                                    <FormDescription>{t('descriptionDescription')}</FormDescription>

                                </FormItem>

                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (

                                <FormItem>

                                    <FormLabel>{t('priceLabel')}</FormLabel>

                                    <FormControl>

                                        <Input
                                            placeholder={t('priceLabel')}
                                            disabled={isLoadingCreate}
                                            type="number"
                                            {...field}
                                        />

                                    </FormControl>

                                    <FormDescription>{t('priceDescription')}</FormDescription>

                                </FormItem>

                            )}
                        />

                        <div className="flex justify-end">

                            <Button disabled={!isValid || isLoadingCreate}>{t('submitButton')}</Button>

                        </div>

                    </form>

                </Form>

            </DialogContent>

        </Dialog>


    )

}

export default CreatePlanForm