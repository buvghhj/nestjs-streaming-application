'use client'

import { Button } from "@/components/ui/common/Button"
import CardConatainer from "@/components/ui/elements/CardConatainer"
import { ConfirmModal } from "@/components/ui/elements/ConfirmModal"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

const DeactivateCard = () => {

    const t = useTranslations('dashboard.settings.account.deactivation')

    const router = useRouter()

    return (

        <CardConatainer heading={t('heading')} description={t('description')} rightContent={
            <div className="flex items-center gap-x-4">

                <ConfirmModal heading={t('confirmModal.heading')} message={t('confirmModal.message')} onConfirm={() => router.push('/account/deactivate')}>

                    <Button>{t('button')}</Button>

                </ConfirmModal>

            </div>}>



        </CardConatainer>

    )

}

export default DeactivateCard