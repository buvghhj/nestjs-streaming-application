'use client'

import { Card } from "@/components/ui/common/Card"
import type { FindChannelByUsernameQuery } from "@/graphql/gennerated/output"
import { WifiOff } from "lucide-react"
import { useTranslations } from "next-intl"
import { CSSProperties } from "react"

interface OfflineStreamProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

const OfflineStream = ({ channel }: OfflineStreamProps) => {

    const t = useTranslations('stream.video')

    const backgroundStyle: CSSProperties = channel.stream.thumbnailUrl
        ?
        {
            backgroundImage: `url(${channel.stream.thumbnailUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }
        :
        {

        }

    return (

        <Card className="flex h-full flex-col items-center justify-center" style={backgroundStyle}>

            {channel.stream.thumbnailUrl &&
                (
                    <>

                        <div className="absolute inset-0 z-0 rounded-lg bg-black opacity-60"></div>

                    </>
                )
            }

            <WifiOff className="z-10 size-12 text-muted-foreground" />

            <p className="z-10 text-lg mt-3 text-white">{channel.displayName} {t('offline')}</p>

        </Card>

    )

}

export default OfflineStream