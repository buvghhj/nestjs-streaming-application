import ResetPasswordForm from '@/components/features/auth/forms/ResetPasswordForm'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export const generateMetadata = async (): Promise<Metadata> => {

    const t = await getTranslations('auth.resetPassword')

    return {

        title: t('heading')

    }

}

const AccountRecoveryPage = () => {

    return (

        <>

            <ResetPasswordForm />

        </>

    )
}

export default AccountRecoveryPage