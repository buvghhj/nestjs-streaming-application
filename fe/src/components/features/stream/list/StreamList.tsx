'use client'

import { Heading } from "@/components/ui/elements/Heading"
import { FindRandomStreamQuery } from "@/graphql/gennerated/output"
import StreamCard from "./StreamCard"
import { EmptyState } from "@/components/ui/elements/EmptyState"

interface StreamListProps {
    heading?: string
    streams: FindRandomStreamQuery['findRandomStream']
}

const StreamList = ({ heading, streams }: StreamListProps) => {

    return (

        <>

            {streams.length ?
                (
                    <>

                        {heading && <Heading title={heading} />}

                        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                            {streams.map((stream, index) => (

                                <StreamCard key={index} stream={stream} />

                            ))}

                        </div>

                    </>
                )
                :
                (
                    <>

                        <EmptyState />

                    </>
                )}

        </>

    )

}

export default StreamList