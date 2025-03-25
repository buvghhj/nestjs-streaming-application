'use client'

import CardConatainer from "@/components/ui/elements/CardConatainer"
import { FindSessionByUserQuery, useFindSessionByUserQuery, useRemoveSessionMutation } from "@/graphql/gennerated/output"
import { getBrowserIcon } from "@/utils/get-browser-icon"
import { useTranslations } from "next-intl"
import SessionModal from "./SessionModal"
import { Button } from "@/components/ui/common/Button"
import { toast } from "sonner"
import { ConfirmModal } from "@/components/ui/elements/ConfirmModal"

interface SessionItemProps {
    session: FindSessionByUserQuery['findSessionsByUser'][0]
    isCurrentSession?: boolean
}

const SessionItem = ({ session, isCurrentSession }: SessionItemProps) => {

    const t = useTranslations('dashboard.settings.sessions.sessionItem')

    const { refetch } = useFindSessionByUserQuery()

    const [removeSession, { loading: isLoadingRemoveSession }] = useRemoveSessionMutation({

        onCompleted() {

            refetch()
            toast.success(t('successMessage'))

        },

        onError() {

            toast.error(t('errorMessage'))

        }

    })

    const Icon = getBrowserIcon(session.metadata?.device?.browser)

    return (

        <CardConatainer
            heading={`${session.metadata.device.browser}, ${session.metadata.device.os}`}
            description={`${session.metadata.location.country}, ${session.metadata.location.city}`}
            Icon={Icon}
            rightContent={

                <div className="flex items-center gap-x-4">

                    {!isCurrentSession && (

                        <ConfirmModal
                            heading={t('confirmModal.heading')}
                            message={t('confirmModal.message')}
                            onConfirm={() => removeSession({ variables: { sessionId: session.id } })}
                        >

                            <Button variant='secondary' disabled={isLoadingRemoveSession}>{t('deleteButton')}</Button>

                        </ConfirmModal>

                    )}

                    <SessionModal session={session} >

                        <Button>{t('detailsButton')}</Button>

                    </SessionModal>

                </div>

            }
        />

    )

}

export default SessionItem