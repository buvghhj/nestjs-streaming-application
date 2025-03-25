import LoginForm from '@/components/features/auth/forms/LoginForm'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export const generateMetadata = async (): Promise<Metadata> => {

    const t = await getTranslations('auth.login')

    return {

        title: t('heading')

    }

}

const LoginPage = () => {

    return (

        <LoginForm />

    )
}

export default LoginPage