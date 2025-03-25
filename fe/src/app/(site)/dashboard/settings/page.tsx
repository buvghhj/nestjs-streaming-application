import UserSettings from "@/components/features/user/UserSettings"
import { NO_INDEX_PAGE } from "@/libs/constants/seo.contant"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const generateMetadata = async (): Promise<Metadata> => {

    const t = await getTranslations('dashboard.settings.header')

    return {

        title: t('heading'),
        description: t('description'),
        ...NO_INDEX_PAGE
    }



}

const SettingsPage = () => {

    return (

        <UserSettings />

    )

}

export default SettingsPage