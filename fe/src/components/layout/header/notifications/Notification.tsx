'use client'

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/common/Popover"
import { useFindUnReadCountNotificationQuery } from "@/graphql/gennerated/output"
import { Bell } from "lucide-react"
import { useTranslations } from "next-intl"
import NotificationList from "./NotificationList"

const Notification = () => {

    const { data, loading: isLoadingNotificationUnreadCount } = useFindUnReadCountNotificationQuery()

    const count = data?.findUnReadCountNotification ?? 0

    const displayCount = count > 100 ? '+99' : count

    if (isLoadingNotificationUnreadCount) {

        return null

    }

    return (

        <Popover>

            <PopoverTrigger>

                {count !== 0 &&
                    (
                        <>

                            <div className="absolute right-[72px] top-5 rounded-full bg-primary px-[5px] text-xs font-semibold text-white">{displayCount}</div>

                        </>
                    )
                }

                <Bell className="size-5 text-foreground" />

            </PopoverTrigger>

            <PopoverContent align="end" className=" max-h-[500px] w-[320px] overflow-y-auto" >

                <NotificationList />

            </PopoverContent>

        </Popover>

    )

}

export default Notification