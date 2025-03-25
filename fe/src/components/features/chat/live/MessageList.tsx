'use client'

import { FindChannelByUsernameQuery, FindChatMessageByStreamQuery, useChatMessageAddedSubscription, useFindChatMessageByStreamQuery, useFindSponsorByChannelQuery } from "@/graphql/gennerated/output"
import { useEffect, useState } from "react"
import MessageItem from "./MessageItem"

interface MessageListProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

const MessageList = ({ channel }: MessageListProps) => {

    const { data } = useFindChatMessageByStreamQuery({

        variables: {

            streamId: channel.stream.id

        }

    })

    const [messages, setMessages] = useState<FindChatMessageByStreamQuery['findChatMessageByStream']>([])

    const { data: sponsorsData, loading } = useFindSponsorByChannelQuery({

        variables: {

            channelId: channel.id

        }

    })

    const sponsors = sponsorsData?.findSponsorByChannel ?? []

    const sponsorsId = new Set(sponsors.map((sponsor => sponsor.user.id)))

    const { data: newMessageData } = useChatMessageAddedSubscription({

        variables: {

            streamId: channel.stream.id

        }

    })

    useEffect(() => {

        if (data && data.findChatMessageByStream) {

            setMessages(data.findChatMessageByStream)

        }

    }, [data])

    useEffect(() => {

        if (newMessageData) {

            const newMessage = newMessageData.chatMessagesAdded

            setMessages(prev => [newMessage, ...prev])

        }

    }, [newMessageData])

    return (

        <div className="flex h-full flex-1 flex-col-reverse overflow-y-auto">

            {messages.map((message, index) => (

                <MessageItem message={message} key={index} isSponsor={sponsorsId.has(message.user.id)} />

            ))}

        </div>

    )

}

export default MessageList