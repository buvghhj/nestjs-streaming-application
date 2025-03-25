'use client'

import { useTranslations } from "next-intl"

const LiveBadge = () => {

    const t = useTranslations('components.liveBadge')

    return (

        <div className="relative flex items-center">

            <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>

            <div className="relative z-10 rounded-full bg-rose-500 p-0.5 px-2 text-center text-xs font-semibold uppercase tracking-wide text-white">

                {t('text')}

            </div>

        </div>

    )

}

export default LiveBadge