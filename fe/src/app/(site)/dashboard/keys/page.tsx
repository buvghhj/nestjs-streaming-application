import KeysSettings from "@/components/features/keys/settings/KeysSettings"
import { NO_INDEX_PAGE } from "@/libs/constants/seo.contant"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const generateMetadata = async (): Promise<Metadata> => {

    const t = await getTranslations('dashboard.keys.header')

    return {

        title: t('heading'),
        description: t('description'),
        ...NO_INDEX_PAGE

    }

}

const KeysSettingsPage = () => {

    return (

        <KeysSettings />

    )

}

export default KeysSettingsPage