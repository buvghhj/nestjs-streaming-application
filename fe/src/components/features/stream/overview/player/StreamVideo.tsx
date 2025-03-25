'use client'

import { FindChannelByUsernameQuery } from "@/graphql/gennerated/output"
import { useConnectionState, useRemoteParticipant, useTracks } from "@livekit/components-react"
import { ConnectionState, Room, Track } from "livekit-client"
import { JSX, useEffect, useRef } from "react"
import OfflineStream from "./OfflineStream"
import LoadingStream from "./LoadingStream"
import StreamPlayer from "./StreamPlayer"
import { Skeleton } from "@/components/ui/common/Skeleton"

interface StreamVideoProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

const StreamVideo = ({ channel }: StreamVideoProps) => {

    const connectionState = useConnectionState()

    const participant = useRemoteParticipant(channel.id)

    const roomRef = useRef<Room | null>(null)

    const tracks = useTracks([

        Track.Source.Camera,
        Track.Source.Microphone

    ]).filter(track => track.participant.identity === channel.id)

    useEffect(() => {

        return () => {

            if (roomRef.current) {

                const room = roomRef.current

                if (room.state !== ConnectionState.Disconnected) {

                    room.disconnect()

                }

                roomRef.current = null

            }

        }

    }, [connectionState])

    let content: JSX.Element

    if (!participant && connectionState === ConnectionState.Connected) {

        content = <OfflineStream channel={channel} />

    } else if (!participant || tracks.length === 0 || connectionState !== ConnectionState.Connected) {

        content = <LoadingStream />

    } else {

        content = <StreamPlayer participant={participant} />

    }

    return (

        <div className="group relative mb-6  aspect-video rounded-lg">{content}</div>

    )

}

export default StreamVideo

export const StreamVideoSkeleton = () => {

    return (

        <div className="mb-6 aspect-video">

            <Skeleton className="h-full w-full rounded-lg" />

        </div>

    )

}