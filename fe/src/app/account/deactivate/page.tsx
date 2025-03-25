import DeactivateForm from "@/components/features/auth/forms/DeactivateForm"
import { NO_INDEX_PAGE } from "@/libs/constants/seo.contant"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const generateMetadata = async (): Promise<Metadata> => {

    const t = await getTranslations('auth.deactivate')

    return {

        title: t('heading'),
        ...NO_INDEX_PAGE

    }

}


const DeactivatePage = () => {

    return (

        <DeactivateForm />

    )

}

export default DeactivatePage