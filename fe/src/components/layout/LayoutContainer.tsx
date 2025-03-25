'use client'

import useMediaQuery from "@/hooks/useMediaQuery"
import { useSidebar } from "@/hooks/useSidebar"
import { cn } from "@/utils/tw-merge"
import { PropsWithChildren, useEffect } from "react"

const LayoutContainer = ({ children }: PropsWithChildren<unknown>) => {

    const isMobile = useMediaQuery('(max-width:1024px)')

    const { isCollapsed, open, close } = useSidebar()

    useEffect(() => {

        if (isMobile) {

            if (!isCollapsed) {

                close()

            }

        } else {

            if (isCollapsed) {

                open()

            }

        }

    }, [isMobile])

    return (

        <main className={cn('mt-[75px] flex-1 p-8', isCollapsed ? 'ml-16' : 'ml-16 lg:ml-64')}>{children}</main>

    )

}

export default LayoutContainer