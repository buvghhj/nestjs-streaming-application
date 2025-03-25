import CategoryOverview from "@/components/features/categories/overview/CategoryOverview"
import StreamList from "@/components/features/stream/list/StreamList"
import { FindCategoryBySlugDocument, FindCategoryBySlugQuery } from "@/graphql/gennerated/output"
import { SERVER_URL } from "@/libs/constants/url.constant"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"

export const generateMetadata = async (props: { params: Promise<{ slug: string }> }): Promise<Metadata> => {

    const params = await props.params

    const { category } = await findCategoryBySlug(params)

    return {

        title: category.title,
        description: category.description,
        openGraph: {

            images: [

                {
                    url: category.thumbnailUrl,
                    alt: category.title
                }

            ]

        }

    }

}

const findCategoryBySlug = async (params: { slug: string }) => {

    try {

        const query = FindCategoryBySlugDocument.loc?.source.body

        const variables = { slug: params.slug }

        const res = await fetch(SERVER_URL!, {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json'

            },
            body: JSON.stringify({ query, variables }),
            next: {

                revalidate: 30

            },

        })

        const data = await res.json()

        return {

            category: data.data.findCategoryBySlug as FindCategoryBySlugQuery['findCategoryBySlug']

        }

    } catch (error) {

        return notFound()

    }

}

const StreamWithCategoryPage = async (props: { params: Promise<{ slug: string }> }) => {

    const t = await getTranslations('categories')

    const params = await props.params

    const { category } = await findCategoryBySlug(params)


    return (

        <CategoryOverview category={category} />

    )

}

export default StreamWithCategoryPage