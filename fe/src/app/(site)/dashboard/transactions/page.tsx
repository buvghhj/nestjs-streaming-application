import TransactionsTable from "@/components/features/sponsorships/transaction/table/TransactionsTable"
import { NO_INDEX_PAGE } from "@/libs/constants/seo.contant"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const generateMetadata = async (): Promise<Metadata> => {

    const t = await getTranslations('dashboard.transactions.header')

    return {

        title: t('heading'),
        description: t('description'),
        ...NO_INDEX_PAGE

    }

}


const TransactionsPage = () => {

    return (

        <TransactionsTable />

    )

}

export default TransactionsPage