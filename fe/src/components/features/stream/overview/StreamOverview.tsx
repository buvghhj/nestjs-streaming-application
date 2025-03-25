'use client'

import { FindChannelByUsernameQuery } from "@/graphql/gennerated/output"
import { useTranslations } from "next-intl"
import { LiveKitRoom } from '@livekit/components-react'
import useStreamToken from "@/hooks/useStreamToken"
import StreamVideo, { StreamVideoSkeleton } from "./player/StreamVideo"
import StreamChat from "./chat/StreamChat"
import StreamInfo, { StreamInfoSkeleton } from "./info/StreamInfo"
import AboutChannel, { AboutChannelSkeleton } from "./info/AboutChannel"
import ChannelSponsor from "./info/ChannelSponsor"
import LiveChat, { LiveChatSkeleton } from "../../chat/live/LiveChat"

interface StreamOverviewProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

const StreamOverview = ({ channel }: StreamOverviewProps) => {

    const t = useTranslations('stream')

    const { token, name, identity } = useStreamToken(channel.id)

    if (!token || !name || !identity) {

        return <StreamOverviewSkeleton />

    }

    return (

        <LiveKitRoom
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
            className="mx-auto max-w-screen-2xl grid grid-cols-1 gap-6 lg:grid-cols-7"
        >

            <div className="order-1 col-span-1 flex flex-col lg:col-span-5">

                <StreamVideo channel={channel} />

                <StreamInfo channel={channel} />

                <AboutChannel channel={channel} />

                <ChannelSponsor channel={channel} />

            </div>

            <div className="order-2 col-span-1 flex h-80 flex-col space-y-6 lg:col-span-2">

                <LiveChat
                    channel={channel}
                    isChatEnabled={channel.stream.isChatEnabled}
                    isChatFollowersOnly={channel.stream.isChatFollowersOnly}
                    isChatPremiumFollowersOnly={channel.stream.isChatPremiumFollowersOnly}
                />

            </div>

        </LiveKitRoom>

    )

}

export default StreamOverview

export const StreamOverviewSkeleton = () => {

    return (

        <div className="mx-auto grid max-w-screen-2xl  grid-cols-1 gap-6 lg:grid-cols-7">


            <div className="order-1 col-span-1 flex flex-col lg:col-span-5">

                <StreamVideoSkeleton />

                <StreamInfoSkeleton />

                <AboutChannelSkeleton />


            </div>

            <div className="order-2 col-span-1 flex h-80 flex-col space-y-6 lg:col-span-2">

                <LiveChatSkeleton />

            </div>

        </div>

    )

}