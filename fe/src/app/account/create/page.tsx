import CreateAccountForm from '@/components/features/auth/forms/CreateAccountForm'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import React from 'react'

export const generateMetadata = async (): Promise<Metadata> => {

    const t = await getTranslations('auth.register')

    return {

        title: t('heading')

    }

}

const CreateAccountPage = () => {

    return (

        <CreateAccountForm />

    )
}

export default CreateAccountPage