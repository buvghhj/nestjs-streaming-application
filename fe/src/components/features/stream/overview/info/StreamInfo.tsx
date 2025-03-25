'use client'

import ChannelAvatar from "@/components/ui/elements/ChannelAvatar"
import { ChannelVerified } from "@/components/ui/elements/ChannelVerified"
import { FindChannelByUsernameQuery } from "@/graphql/gennerated/output"
import { useParticipants } from "@livekit/components-react"
import { User } from "lucide-react"
import { useTranslations } from "next-intl"
import StreamAction, { StreamActionsSkeleton } from "./StreamAction"
import { Skeleton } from "@/components/ui/common/Skeleton"

interface StreamInfoProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

const StreamInfo = ({ channel }: StreamInfoProps) => {

    const t = useTranslations('stream.info')

    const participant = useParticipants()

    const participantCount = participant.length - 1

    return (

        <div className="space-y-5">

            <h1 className="font-semibold text-xl">

                {channel.stream.title} {' '} {channel.stream.category && ` | ${channel.stream.category.title}`}

            </h1>

            <div className=" flex flex-col items-start justify-between lg:flex-row">

                <div className="flex items-center gap-x-3 px-1">

                    <ChannelAvatar channel={channel} isLive={channel.stream.isLive} size='lg' />


                    <div className="space-y-1">

                        <h2 className="items-center  flex gap-x-2 text-lg font-semibold">

                            {channel.displayName}
                            {channel.isVerified && <ChannelVerified />}

                        </h2>

                        {channel.stream.isLive ? (

                            <div className="flex items-center gap-x-1 text-xs font-semibold text-rose-500">

                                <User className="size-4" />
                                {participantCount} {t('viewers')}

                            </div>

                        )
                            :
                            (
                                <>

                                    <p className="text-xs font-semibold text-muted-foreground">{t('offline')}</p>

                                </>
                            )}

                    </div>

                </div>

                <StreamAction channel={channel} />

            </div>


        </div>

    )

}

export default StreamInfo

export const StreamInfoSkeleton = () => {

    return (

        <div className="space-y-5">

            <Skeleton className="h-7 w-[60%]" />

            <div className="flex flex-col items-start justify-between lg:flex-row">

                <div className="flex items-center gap-x-3 px-1">

                    <Skeleton className="size-14 rounded-full" />

                    <div className="space-y-2.5">

                        <Skeleton className="h-4 w-32" />

                        <Skeleton className="h-3 w-20" />

                    </div>

                </div>

                <StreamActionsSkeleton />

            </div>

        </div>

    )

}