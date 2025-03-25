'use client'

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/common/Dialog"
import { FindSessionByUserQuery } from "@/graphql/gennerated/output"
import { formatDate } from "@/utils/format-date"
import { useTranslations } from "next-intl"
import { PropsWithChildren, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false })

const L = typeof window !== "undefined" ? require("leaflet") : null

interface SessionModal {

    session: FindSessionByUserQuery["findSessionsByUser"][0]

}

const SessionModal = ({ children, session }: PropsWithChildren<SessionModal>) => {

    const t = useTranslations("dashboard.settings.sessions.sessionModal")

    const center: [number, number] = [

        session.metadata.location.latidute,

        session.metadata.location.longtitude

    ]

    const [customIcon, setCustomIcon] = useState<L.Icon | null>(null)

    useEffect(() => {

        if (typeof window !== "undefined") {

            import("leaflet").then(L => {

                const icon = new L.Icon({
                    iconUrl: "/marker-icon.png",
                    iconSize: [16, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32],
                })

                setCustomIcon(icon)

            })

        }

    }, [])

    return (
        <Dialog>

            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent>

                <DialogTitle className="text-xl">{t("heading")}</DialogTitle>

                <div className="space-y-3">

                    <div className="flex items-center">
                        <span className="font-medium">{t("device")}</span>
                        <span className="ml-2 text-muted-foreground">
                            {session.metadata.device.browser}, {session.metadata.device.os}
                        </span>
                    </div>

                    <div className="flex items-center">
                        <span className="font-medium">{t("location")}</span>
                        <span className="ml-2 text-muted-foreground">
                            {session.metadata.location.country}, {session.metadata.location.city}
                        </span>
                    </div>

                    <div className="flex items-center">
                        <span className="font-medium">{t("ipAddress")}</span>
                        <span className="ml-2 text-muted-foreground">{session.metadata.ip}</span>
                    </div>

                    <div className="flex items-center">
                        <span className="font-medium">{t("createdAt")}</span>
                        <span className="ml-2 text-muted-foreground">
                            {formatDate(session.createdAt, true)}
                        </span>
                    </div>

                    <div style={{ width: "100%", height: "300px" }}>

                        <MapContainer center={center} zoom={11} style={{ width: "100%", height: "100%" }}>

                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />

                            {customIcon && (

                                <Marker position={center} icon={customIcon}>
                                    <Popup>{session.metadata.location.city}</Popup>
                                </Marker>

                            )}

                        </MapContainer>

                    </div>

                </div>

            </DialogContent>

        </Dialog>

    )

}

export default SessionModal
