import StreamOverview from "@/components/features/stream/overview/StreamOverview"
import { FindChannelByUsernameDocument, FindChannelByUsernameQuery } from "@/graphql/gennerated/output"
import { SERVER_URL } from "@/libs/constants/url.constant"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const generateMetadata = async (props: { params: Promise<{ username: string }> }): Promise<Metadata> => {

    const params = await props.params

    const { channel } = await findChannelByUsername(params)

    return {

        title: channel.displayName,
        description: channel.bio ?? channel.displayName,
        openGraph: {

            images: [

                {
                    url: channel.avatar!,
                    alt: channel.displayName
                }

            ]

        }

    }

}

const findChannelByUsername = async (params: { username: string }) => {

    try {

        const query = FindChannelByUsernameDocument.loc?.source.body

        const variables = { username: params.username }

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

            channel: data.data.findChannelByUsername as FindChannelByUsernameQuery['findChannelByUsername']

        }

    } catch (error) {

        return notFound()

    }

}

const SingleChannelPage = async (props: { params: Promise<{ username: string }> }) => {

    const params = await props.params

    const { channel } = await findChannelByUsername(params)


    return (

        <StreamOverview channel={channel} />

    )

}

export default SingleChannelPage