import ChangeChatSetting from "@/components/features/chat/settings/ChangeChatSetting"
import { NO_INDEX_PAGE } from "@/libs/constants/seo.contant"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const generateMetadata = async (): Promise<Metadata> => {

    const t = await getTranslations('dashboard.chat.header')

    return {

        title: t('heading'),
        description: t('description'),
        ...NO_INDEX_PAGE

    }

}

const ChatSettingPage = () => {

    return (

        <ChangeChatSetting />

    )

}

export default ChatSettingPage