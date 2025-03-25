import CategoriesList from "@/components/features/categories/list/CategoriesList"
import { FindAllCategoriesDocument, FindAllCategoriesQuery } from "@/graphql/gennerated/output"
import { SERVER_URL } from "@/libs/constants/url.constant"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const generateMetadata = async (): Promise<Metadata> => {

    const t = await getTranslations('categories')

    return {

        title: t('heading')

    }

}

const findAllCategories = async () => {

    try {

        const query = FindAllCategoriesDocument.loc?.source.body

        const res = await fetch(SERVER_URL!, {

            method: 'POST',
            headers: {

                'Content-Type': 'application/json'

            },
            body: JSON.stringify({ query }),
            next: {

                revalidate: 30

            }

        })

        const data = await res.json()

        return {

            categories: data.data.findAllCategories as FindAllCategoriesQuery['findAllCategories']

        }

    } catch (error) {

        console.log(error)

        throw new Error('Error fetching categories')

    }

}


const CategoriesPage = async () => {

    const t = await getTranslations('')

    const { categories } = await findAllCategories()

    return (

        <CategoriesList heading={t('categories.heading')} categories={categories} />

    )

}

export default CategoriesPage