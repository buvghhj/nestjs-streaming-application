'use client'

import { useTranslations } from "next-intl"
import { RouteItem } from "./interfaces/route.interface"
import { Folder, Home, Radio, Flame } from "lucide-react"
import SidebarItem from "./SidebarItem"
import RecommendedChannel from "./RecommendedChannel"

const UserNav = () => {

    const t = useTranslations('layout.sidebar.userNav')

    const routes: RouteItem[] = [
        {
            label: t('home'),
            href: '/',
            icon: Home
        },
        {
            label: t('categories'),
            href: '/categories',
            icon: Folder,
        },
        {
            label: t('streams'),
            href: '/streams',
            icon: Radio
        }

    ]


    return (

        <div className="spac-y-2 px-2 pt-4 lg:pt-0">

            {routes.map((route, index) => (

                <div key={index} className="mt-2">
                    <SidebarItem route={route} />
                </div>
            ))}

            <div className="mt-2">

                <RecommendedChannel />


            </div>

        </div>

    )

}

export default UserNav