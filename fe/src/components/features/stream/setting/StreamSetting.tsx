'use client'

import { Button } from "@/components/ui/common/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/common/Dialog"
import { FindChannelByUsernameQuery } from "@/graphql/gennerated/output"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { Settings } from "lucide-react"
import { useTranslations } from "next-intl"
import ChangeThumbnailForm from "./ChangeThumbnailForm"
import ChangeStreamInfo from "./ChangeStreamInfo"

interface StreamSettingProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

const StreamSetting = ({ channel }: StreamSettingProps) => {

    const t = useTranslations('stream.settings')

    const { user } = useCurrentUser()

    const isOwnerChannel = user?.id === channel.id

    if (!isOwnerChannel) return null

    return (

        <Dialog>

            <DialogTrigger asChild>

                <Button variant='ghost' size='lgIcon'>

                    <Settings className="size-5" />

                </Button>

            </DialogTrigger>

            <DialogContent>

                <DialogHeader>

                    <DialogTitle>{t("heading")}</DialogTitle>

                </DialogHeader>

                <ChangeThumbnailForm stream={channel.stream} />

                <ChangeStreamInfo stream={channel.stream} />

            </DialogContent>

        </Dialog>

    )

}

export default StreamSetting