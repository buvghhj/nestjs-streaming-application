'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/common/Card"
import ChannelAvatar from "@/components/ui/elements/ChannelAvatar"
import { FindChannelByUsernameQuery, useFindSponsorByChannelQuery } from "@/graphql/gennerated/output"
import { useTranslations } from "next-intl"
import Link from "next/link"

interface ChannelSponsorProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

const ChannelSponsor = ({ channel }: ChannelSponsorProps) => {

    const t = useTranslations('stream.sponsors')

    const { data, loading: isLoadingSponosors } = useFindSponsorByChannelQuery({

        variables: {

            channelId: channel.id

        }

    })

    const sponsors = data?.findSponsorByChannel ?? []

    if (!sponsors.length || isLoadingSponosors) {

        return null

    }

    return (

        <Card className="mt-6">

            <CardHeader className="p-4">

                <CardTitle className="text-xl">

                    {t('heading')} {channel.displayName}

                </CardTitle>

            </CardHeader>

            <CardContent className="grid grid-cols-12 px-4">

                {sponsors.map((sponsor, i) => (

                    <Link href={`/${sponsor.user.username}`} key={i} className="mt-2">

                        <ChannelAvatar channel={sponsor.user} size='lg' />

                    </Link>

                ))}

            </CardContent>

        </Card>

    )

}

export default ChannelSponsor