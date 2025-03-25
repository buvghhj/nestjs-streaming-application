'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/common/Card"
import { Skeleton } from "@/components/ui/common/Skeleton"
import { FindChannelByUsernameQuery } from "@/graphql/gennerated/output"
import { getSocialIcon } from "@/utils/get-social-icon"
import { useTranslations } from "next-intl"
import Link from "next/link"

interface AboutChannelProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

const AboutChannel = ({ channel }: AboutChannelProps) => {

    const t = useTranslations('stream.aboutChannel')

    return (

        <Card className="mt-6">

            <CardHeader className="p-4">

                <CardTitle className="text-xl">

                    {t('heading')} {channel.displayName}

                </CardTitle>

            </CardHeader>

            <CardContent className="-mt-1 space-y-2 px-4">

                <div className="text-[15px] text-foreground">

                    <span className="font-semibold">{channel.followings.length} </span>

                    {' '}

                    {t('followersCount')}

                </div>

                <div className="text-[15px] text-muted-foreground">

                    {channel?.bio ?? t('noDescription')}

                </div>

                {channel.socialLinks.length ?
                    (
                        <>

                            <div className="grid gap-x-3 md:grid-cols-3 xl:grid-cols-8">


                                {channel.socialLinks.map((socialLink, i) => {

                                    const Icon = getSocialIcon(socialLink.url)

                                    return (

                                        <Link href={socialLink.url} key={i} className="flex items-center pr-1 text-[15px] gap-2 hover:text-primary" target="_blank">

                                            <Icon className="size-5 mr-1" />

                                            {socialLink.title}

                                        </Link>

                                    )
                                })}

                            </div>

                        </>
                    )
                    :
                    (null)}

            </CardContent>

        </Card>

    )

}

export default AboutChannel

export const AboutChannelSkeleton = () => {

    return (

        <Skeleton className="mt-6 h-36 w-full" />

    )

}