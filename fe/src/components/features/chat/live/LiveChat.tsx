'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/common/Card"
import { Skeleton } from "@/components/ui/common/Skeleton"
import { FindChannelByUsernameQuery, useFindMyFollowingQuery, useFindSponsorByChannelQuery } from "@/graphql/gennerated/output"
import { useAuth } from "@/hooks/useAuth"
import { useConnectionState, useRemoteParticipant } from "@livekit/components-react"
import { ConnectionState } from "livekit-client"
import { MessageSquareOff } from "lucide-react"
import { useTranslations } from "next-intl"
import LoadingChat from "./LoadingChat"
import SendMessageForm from "./SendMessageForm"
import MessageList from "./MessageList"
import ChatInfo from "./ChatInfo"
import { useCurrentUser } from "@/hooks/useCurrentUser"

interface LiveChatProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
    isChatEnabled: boolean
    isChatFollowersOnly: boolean
    isChatPremiumFollowersOnly: boolean
}

const LiveChat = ({ channel, isChatEnabled, isChatFollowersOnly, isChatPremiumFollowersOnly }: LiveChatProps) => {

    const t = useTranslations('stream.chat')

    const { isAuthenticated } = useAuth()

    const { user, isLoadingProfile } = useCurrentUser()

    const { data: followingsData, loading: isLoadingFollowings } = useFindMyFollowingQuery({

        skip: !isAuthenticated

    })

    const { data: sponsorsData, loading: isLoadingSponsors } = useFindSponsorByChannelQuery({

        variables: {

            channelId: channel.id

        }

    })

    const followings = followingsData?.findMyFollowings ?? []

    const sponsors = sponsorsData?.findSponsorByChannel ?? []

    const isOwnerChannel = user?.id === channel.id

    const isFollower = followings.some(following => following.followingId === channel.id)

    const isSponsor = sponsors.some(sponsor => sponsor.user.id === user?.id)

    const connectionState = useConnectionState()

    const participant = useRemoteParticipant(channel.id)

    const isOnline = participant && connectionState === ConnectionState.Connected

    const isDisabled =
        !isOnline ||
        !isAuthenticated ||
        !isChatEnabled ||
        (isChatFollowersOnly && !isFollower && !isOwnerChannel) ||
        (isChatPremiumFollowersOnly && !isSponsor && !isOwnerChannel)

    if (connectionState === ConnectionState.Connecting || isLoadingProfile || isLoadingFollowings || isLoadingSponsors) {

        return <LoadingChat />

    }

    return (

        <Card className="lg:fixed w-full overflow-y-auto flex h-[82%] lg:w-[21.5%] flex-col xl:mt-0">

            <CardHeader className="border-b py-2">

                <CardTitle className="text-center text-lg">

                    {t('heading')}

                </CardTitle>

            </CardHeader>

            <CardContent className="flex h-full flex-col overflow-y-auto p-4">

                {isOnline ?
                    (
                        <>

                            <MessageList channel={channel} />

                            <ChatInfo
                                isOwnerChannel={isOwnerChannel}
                                isFollower={isFollower}
                                isSponsor={isSponsor}
                                isChatEnabled={isChatEnabled}
                                isChatFollowersOnly={isChatFollowersOnly}
                                isChatPremiumFollowersOnly={isChatPremiumFollowersOnly}
                            />

                            <SendMessageForm channel={channel} isDisabled={isDisabled} />

                        </>
                    )
                    :
                    (
                        <>

                            <div className="flex h-full flex-col items-center justify-center">

                                <MessageSquareOff className="size-10 text-muted-foreground" />

                                <h2 className="mt-3 text-xl font-medium">{t('unavailable')}</h2>

                                <p className="mt-2 w-full text-center text-muted-foreground">{t('unavailableMessage')}</p>

                            </div>

                        </>
                    )}

            </CardContent>

        </Card>

    )

}

export default LiveChat

export const LiveChatSkeleton = () => {

    return (

        <Skeleton className="fixed my-8 flex h-[82%] w-[21.5%] flex-col xl:mt-0" />

    )

}