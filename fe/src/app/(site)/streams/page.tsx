import StreamContent from "@/components/features/stream/list/StreamContent"
import StreamList from "@/components/features/stream/list/StreamList"
import { FindAllStreamDocument, FindAllStreamQuery } from "@/graphql/gennerated/output"
import { SERVER_URL } from "@/libs/constants/url.constant"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const generateMetadata = async (props: { searchParams: Promise<{ searchTerm: string }> }): Promise<Metadata> => {

    const t = await getTranslations('streams')

    const searchParams = await props.searchParams

    return {

        title: searchParams.searchTerm ? `${t('searchHeading')} "${searchParams.searchTerm}"` : t('heading'),

    }

}

const findAllStreams = async () => {

    try {

        const query = FindAllStreamDocument.loc?.source.body

        const variables = {

            filters: {

            }

        }

        const res = await fetch(SERVER_URL!, {

            method: 'POST',
            headers: {

                'Content-Type': 'application/json'

            },
            body: JSON.stringify({ query, variables }),
            next: {

                revalidate: 30

            }

        })

        const data = await res.json()

        console.log('ádfsadf', data);

        return {

            streams: data.data?.findAllStreams as FindAllStreamQuery['findAllStreams']

        }

    } catch (error) {

        console.log(error)

        throw new Error('Error fetching streams')

    }

}


const StreamsPage = async () => {

    const { streams } = await findAllStreams()

    return (

        <StreamContent streams={streams} />
    )

}

export default StreamsPage