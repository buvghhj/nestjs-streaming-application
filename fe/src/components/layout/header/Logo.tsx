'use client'

import { LogoImage } from '@/components/images/LogoImages'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = () => {

    const t = useTranslations('layout.header.logo')

    return (

        <Link href='/' className='items-center flex  gap-x-4 transition-opacity hover:opacity-75'>

            <LogoImage />

            <div className='hidden leading-tight lg:block'>

                <h2 className='text-lg  font-semibold tracking-wider text-accent-foreground'>

                    TanStream

                </h2>

                <p className='text-sm text-muted-foreground'>{t('platform')}</p>

            </div>

        </Link>

    )

}

export default Logo