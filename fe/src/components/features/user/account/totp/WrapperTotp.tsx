'use client'

import { Skeleton } from "@/components/ui/common/Skeleton"
import CardConatainer from "@/components/ui/elements/CardConatainer"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useTranslations } from "next-intl"
import EnableTotp from "./EnableTotp"
import DisableTotp from "./DisableTotp"

const WrapperTotp = () => {

    const t = useTranslations('dashboard.settings.account.twoFactor')

    const { user, isLoadingProfile } = useCurrentUser()

    return (

        <>

            {isLoadingProfile ?
                (
                    <>

                        <WrapperTotpSkeleton />

                    </>
                )
                :
                (
                    <>

                        <CardConatainer
                            heading={t('heading')}
                            description={t('description')}
                            rightContent={<div className="gap-x-4 items-center flex">{!user?.isTotpEnabled ? <EnableTotp /> : <DisableTotp />}</div>}
                        >


                        </CardConatainer>

                    </>
                )
            }

        </>

    )

}

export default WrapperTotp


export const WrapperTotpSkeleton = () => {

    return <Skeleton className="h-24 w-full" />

}