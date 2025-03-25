import NewPasswordForm from '@/components/features/auth/forms/NewPasswordForm'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export const generateMetadata = async (): Promise<Metadata> => {

    const t = await getTranslations('auth.newPassword')

    return {

        title: t('heading')

    }

}

const NewPasswordPage = () => {

    return (

        <>

            <NewPasswordForm />

        </>

    )
}

export default NewPasswordPage