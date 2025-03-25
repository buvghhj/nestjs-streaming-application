'use client'

import { Separator } from "@/components/ui/common/Separator"
import { useFindRecommendedChannelsQuery } from "@/graphql/gennerated/output"
import { useSidebar } from "@/hooks/useSidebar"
import { useTranslations } from "next-intl"
import ChannelItem, { ChannelItemSkeleton } from "./ChannelItem"

const RecommendedChannel = () => {

    const t = useTranslations('layout.sidebar.recommended')

    const { isCollapsed } = useSidebar()

    const { data, loading: isLoadingRecommended } = useFindRecommendedChannelsQuery()

    const channels = data?.findRecommendedChannels ?? []


    return (


        <>

            <Separator className="mb-3" />

            {!isCollapsed && (

                <h2 className="text-lg mb-2 px-2 font-semibold text-foreground">{t('heading')}</h2>

            )}

            {isLoadingRecommended ?
                (

                    Array.from({ length: 12 }).map((_, index) => (

                        <ChannelItemSkeleton key={index} />

                    ))

                )
                :
                channels.map((channel, index) => (


                    <div key={index}>
                        <ChannelItem channel={channel} />
                    </div>


                ))}

        </>


    )

}

export default RecommendedChannel