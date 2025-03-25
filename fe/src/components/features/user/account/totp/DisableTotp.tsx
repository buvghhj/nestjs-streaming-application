'use client'

import { Button } from "@/components/ui/common/Button"
import { ConfirmModal } from "@/components/ui/elements/ConfirmModal"
import { useDisableTotpMutation } from "@/graphql/gennerated/output"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

const DisableTotp = () => {

    const t = useTranslations('dashboard.settings.account.twoFactor.disable')

    const { refetch } = useCurrentUser()

    const [disable, { loading: isLoadingDisable }] = useDisableTotpMutation({

        onCompleted() {

            refetch()
            toast.success(t('successMessage'))

        },

        onError() {

            toast.error(t('errorMessage'))


        }

    })

    return (

        <ConfirmModal heading={t('heading')} message={t('message')} onConfirm={() => disable()}>

            <Button variant='secondary' disabled={isLoadingDisable}>{t('trigger')}</Button>

        </ConfirmModal>

    )

}

export default DisableTotp