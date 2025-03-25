'use client'

import { Form, FormField } from "@/components/ui/common/Form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/common/Select"
import CardConatainer from "@/components/ui/elements/CardConatainer"
import ToggleCard from "@/components/ui/elements/ToggleCard"
import { setLanguage } from "@/libs/i18n/language"
import { changeLanguageSchema, TypeChangeLanguageSchema } from "@/schemas/user/change-language.schema"
import { changeThemeSchema, TypeChangeThemeSchema } from "@/schemas/user/change-theme.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale, useTranslations } from "next-intl"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const languages = {

    en: 'English',
    vi: 'Tiếng việt',
    ru: 'Русский',

}

const ChangeLanguageForm = () => {

    const t = useTranslations('dashboard.settings.appearance.language')

    const [isPending, startTransision] = useTransition()

    const locale = useLocale()

    const form = useForm<TypeChangeLanguageSchema>({

        resolver: zodResolver(changeLanguageSchema),

        values: {

            language: locale as TypeChangeLanguageSchema['language']

        }

    })

    const onSubmit = (data: TypeChangeLanguageSchema) => {

        startTransision(async () => {

            try {

                await setLanguage(data.language)

            } catch (error) {

                toast.success(t('successMessage'))

            }

        })

    }

    return (

        <CardConatainer
            heading={t('heading')}
            description={t('description')}
            rightContent={

                <Form {...form}>

                    <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (

                            <Select
                                onValueChange={value => {
                                    field.onChange(value)
                                    form.handleSubmit(onSubmit)()
                                }}
                                value={field.value}
                            >

                                <SelectTrigger className="w-[180px]">

                                    <SelectValue placeholder={t('selectPlaceholder')} />

                                </SelectTrigger>

                                <SelectContent>

                                    {Object.entries(languages).map(([code, name]) => (

                                        <SelectItem key={code} value={code} disabled={isPending}>

                                            {name}

                                        </SelectItem>

                                    ))}

                                </SelectContent>

                            </Select>

                        )}
                    />

                </Form>

            }
        />

    )

}

export default ChangeLanguageForm