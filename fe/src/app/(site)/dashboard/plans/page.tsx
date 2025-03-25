import PlanTable from "@/components/features/sponsorships/plan/table/PlanTable"
import { NO_INDEX_PAGE } from "@/libs/constants/seo.contant"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const generateMetadata = async (): Promise<Metadata> => {

    const t = await getTranslations('dashboard.plans.header')

    return {

        title: t('heading'),
        description: t('description'),
        ...NO_INDEX_PAGE

    }

}


const SponsorshipPlan = () => {

    return (

        <PlanTable />

    )

}

export default SponsorshipPlan