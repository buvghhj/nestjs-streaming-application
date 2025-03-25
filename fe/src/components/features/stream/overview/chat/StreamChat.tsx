'use client'

import { FindChannelByUsernameQuery } from "@/graphql/gennerated/output"

interface StreamChatProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

const StreamChat = ({ channel }: StreamChatProps) => {

    return (

        <div>StreamChat</div>

    )

}

export default StreamChat