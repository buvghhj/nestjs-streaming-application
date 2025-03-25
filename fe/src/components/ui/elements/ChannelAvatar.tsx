import { FindProfileQuery } from "@/graphql/gennerated/output";
import { cva, VariantProps } from "class-variance-authority";
import { Avatar, AvatarFallback, AvatarImage } from "../common/Avatar";
import { cn } from "@/utils/tw-merge";

const avatarSize = cva('', {

    variants: {

        size: {

            sm: 'size-7',

            default: 'size-9',

            lg: 'size-14',

            xl: 'size-32'

        }

    },

    defaultVariants: {

        size: 'default'

    }

})

interface ChannelAvatarProps extends VariantProps<typeof avatarSize> {

    channel: Pick<FindProfileQuery['findProfile'], 'username' | 'avatar'>,

    isLive?: boolean

}


const ChannelAvatar = ({ size, channel, isLive }: ChannelAvatarProps) => {

    return (

        <div className="relative">

            <Avatar className={cn(avatarSize({ size }), isLive && 'ring-2  ring-rose-500')}>

                <AvatarImage key={channel.avatar} src={channel.avatar || undefined} className="object-cover" />

                <AvatarFallback className={cn(size === 'xl' && 'text-4xl', size === 'lg' && 'text-2xl')} >

                    {channel.username ? channel.username[0] : '?'}

                </AvatarFallback>

            </Avatar>

        </div>

    )

}

export default ChannelAvatar