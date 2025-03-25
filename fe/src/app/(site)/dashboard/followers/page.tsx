import FollowersTable from "@/components/features/follow/table/FollowersTable"
import { NO_INDEX_PAGE } from "@/libs/constants/seo.contant"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const generateMetadata = async (): Promise<Metadata> => {

    const t = await getTranslations('dashboard.followers.header')

    return {

        title: t('heading'),
        description: t('description'),
        ...NO_INDEX_PAGE

    }

}

const FollowersPage = () => {

    return (

        <FollowersTable />

    )

}

export default FollowersPage