'use client'

import { Button } from "@/components/ui/common/Button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/common/Popover"
import type { FindChannelByUsernameQuery } from "@/graphql/gennerated/output"
import { Share } from "lucide-react"
import { useTranslations } from "next-intl"
import { FaTelegram } from "react-icons/fa"
import { FaFacebook, FaReddit, FaXTwitter } from "react-icons/fa6"
import { FacebookShareButton, RedditShareButton, TelegramShareButton, TwitterShareButton } from 'react-share'

interface ShareActionProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

const ShareAction = ({ channel }: ShareActionProps) => {

    const t = useTranslations('stream.actions.share')

    const shareUrl = `${window.location.origin}/${channel.username}`

    return (

        <Popover>

            <PopoverTrigger asChild>

                <Button variant='ghost' size='lgIcon'>

                    <Share className="size-5" />

                </Button>

            </PopoverTrigger>

            <PopoverContent side="top" className="w-[300px]">

                <h2 className="font-medium">{t('heading')}</h2>

                <div className="mt-4 grid grid-cols-4 gap-3">

                    <TelegramShareButton url={shareUrl}>

                        <div className="flex h-14 items-center justify-center rounded-md bg-sky-500 transition-transform hover:-translate-y-1.5">

                            <FaTelegram className="size-7 text-white" />

                        </div>

                    </TelegramShareButton>

                    <TwitterShareButton url={shareUrl}>

                        <div className="flex h-14 items-center justify-center rounded-md bg-black transition-transform hover:-translate-y-1.5">

                            <FaXTwitter className="size-7 text-white" />

                        </div>

                    </TwitterShareButton>

                    <FacebookShareButton url={shareUrl}>

                        <div className="flex h-14 items-center justify-center rounded-md bg-sky-700 transition-transform hover:-translate-y-1.5">

                            <FaFacebook className="size-7 text-white" />

                        </div>

                    </FacebookShareButton>

                    <RedditShareButton url={shareUrl}>

                        <div className="flex h-14 items-center justify-center rounded-md bg-orange-600 transition-transform hover:-translate-y-1.5">

                            <FaReddit className="size-7 text-white" />

                        </div>

                    </RedditShareButton>

                </div>

            </PopoverContent>

        </Popover>

    )

}

export default ShareAction