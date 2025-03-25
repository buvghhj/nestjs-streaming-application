'use client'

import { FindAllStreamQuery, useFindAllStreamQuery } from "@/graphql/gennerated/output"
import StreamList from "./StreamList"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Heading } from "@/components/ui/elements/Heading"
import InfiniteScroll from 'react-infinite-scroll-component'
import { StreamCardSkeleton } from "./StreamCard"

interface StreamContent {
    streams: FindAllStreamQuery['findAllStreams']
}

const StreamContent = ({ streams }: StreamContent) => {

    const t = useTranslations('streams')

    const searchParams = useSearchParams()

    const searchTerm = searchParams.get('searchTerm')

    const [streamList, setStreamList] = useState<FindAllStreamQuery['findAllStreams']>(streams ?? [])

    const [hasMore, setHasMore] = useState(true)

    const { data, fetchMore } = useFindAllStreamQuery({

        variables: {

            filters: {

                searchTerm,
                take: 12,
                skip: 0

            }

        },

        fetchPolicy: 'network-only'

    })

    useEffect(() => {

        if (data?.findAllStreams) {

            setStreamList(data.findAllStreams)
            setHasMore(data.findAllStreams.length === 12)

        }

    }, [data, searchTerm])

    const fetchMoreStreams = async () => {

        if (!hasMore) return

        setTimeout(async () => {

            const { data: newData } = await fetchMore({

                variables: {

                    filters: {

                        searchTerm,
                        take: 12,
                        skip: streamList.length

                    }

                }

            })

            if (newData.findAllStreams.length) {

                setStreamList(prev => [...prev, ...newData.findAllStreams])

            } else {

                setHasMore(false)

            }

        }, 300)

    }

    return (

        <>

            <Heading title={searchTerm ? `${t('searchHeading')} "${searchTerm}"` : t('heading')} />

            <InfiniteScroll
                dataLength={streamList.length}
                next={fetchMoreStreams}
                hasMore={hasMore}
                loader={

                    <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                        {Array.from({ length: 12 }).map((_, index) => (

                            <StreamCardSkeleton key={index} />

                        ))}

                    </div>

                }
            >

                <StreamList streams={streamList} />

            </InfiniteScroll>

        </>

    )

}

export default StreamContent