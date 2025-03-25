import SponsorTable from "@/components/features/sponsorships/subscription/table/SponsorTable"
import { NO_INDEX_PAGE } from "@/libs/constants/seo.contant"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const generateMetadata = async (): Promise<Metadata> => {

    const t = await getTranslations('dashboard.sponsors.header')

    return {

        title: t('heading'),
        description: t('description'),
        ...NO_INDEX_PAGE

    }

}

const SponsorsPage = () => {

    return (

        <SponsorTable />

    )

}

export default SponsorsPage