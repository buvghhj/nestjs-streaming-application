'use client'

import { FindChannelByUsernameQuery } from "@/graphql/gennerated/output"
import FollowButton from "./FollowButton"
import SupportButton from "./SupportButton"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import ShareAction from "./ShareAction"
import { Skeleton } from "@/components/ui/common/Skeleton"
import StreamSetting from "../../setting/StreamSetting"

interface StreamActionProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

const StreamAction = ({ channel }: StreamActionProps) => {

    const { user } = useCurrentUser()

    return (

        <div className='mt-5 items-center space-x-3 space-y-4 lg:mt-0 lg:flex lg:space-y-0'>

            <FollowButton channel={channel} />

            {channel.isVerified && channel.sponsorshipPlans.length && (<SupportButton channel={channel} />)}

            <StreamSetting channel={channel} />

            <ShareAction channel={channel} />

        </div>

    )

}

export default StreamAction

export const StreamActionsSkeleton = () => {

    return (

        <div className='mt-6 lg:mt-0'>

            <div className='items-center gap-x-4 space-y-4 lg:flex lg:space-y-0'>

                <Skeleton className='h-10 w-44 rounded-full' />

                <Skeleton className='size-10 rounded-full' />

            </div>

        </div>

    )
}
