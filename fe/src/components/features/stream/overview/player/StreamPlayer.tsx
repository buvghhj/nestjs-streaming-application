'use client'

import { useTracks } from "@livekit/components-react"
import { RemoteParticipant, Track } from "livekit-client"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import VolumeControl from "./VolumeControl"
import { useEventListener } from 'usehooks-ts'
import FullScreenControl from "./FullScreenControl"

interface StreamPlayerProps {
    participant: RemoteParticipant
}

const StreamPlayer = ({ participant }: StreamPlayerProps) => {

    const t = useTranslations('stream.video.player')

    const videoRef = useRef<HTMLVideoElement>(null)

    const wrapperRef = useRef<HTMLDivElement>(null)

    const [volume, setVolume] = useState(0)

    const [isFullScreen, setIsFullScreen] = useState(false)

    const onVolumeChange = (value: number) => {

        setVolume(+value)

        if (videoRef.current) {

            videoRef.current.muted = value === 0

            videoRef.current.volume = +value * 0.01

        }

    }

    const toggleMute = () => {

        const isMuted = volume === 0

        setVolume(isMuted ? 50 : 0)

        if (videoRef.current) {

            videoRef.current.muted = !isMuted

            videoRef.current.volume = isMuted ? 0.5 : 0

        }

    }

    useEffect(() => {

        onVolumeChange(0)

    }, [])

    const toggleFullScreen = () => {

        if (isFullScreen) {

            document.exitFullscreen()

        } else if (wrapperRef.current) {

            wrapperRef.current.requestFullscreen()

        }

    }

    const handleFullScreenChange = () => {

        const isCurrentlyFullScreen = document.fullscreenElement !== null

        setIsFullScreen(isCurrentlyFullScreen)

    }

    useEventListener('fullscreenchange' as keyof WindowEventMap,

        handleFullScreenChange

    )

    useTracks([

        Track.Source.Camera,
        Track.Source.Microphone

    ]).filter(track =>

        track.participant.identity === participant.identity

    ).forEach(track => {

        if (videoRef.current) {

            track.publication.track?.attach(videoRef.current)

        }

    })

    return (

        <div ref={wrapperRef} className="relative flex h-full ">

            <video ref={videoRef} className="rounded-lg" />

            <div className="absolute top-0 h-full w-full opacity-0 hover:opacity-100">

                <div className="absolute  bottom-0 flex h-16 w-full items-center justify-between px-4">

                    <VolumeControl onToggle={toggleMute} onChange={onVolumeChange} value={volume} />

                    <FullScreenControl isFullScreen={isFullScreen} onToggle={toggleFullScreen} />

                </div>

            </div>

        </div >

    )

}

export default StreamPlayer