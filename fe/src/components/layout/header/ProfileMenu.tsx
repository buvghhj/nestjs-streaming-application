'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/common/DropdownMenu'
import ChannelAvatar from '@/components/ui/elements/ChannelAvatar'
import { useLogoutUserMutation } from '@/graphql/gennerated/output'
import { useAuth } from '@/hooks/useAuth'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { LayoutDashboard, Loader2, LogOutIcon, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
import Notification from './notifications/Notification'

const ProfileMenu = () => {

    const t = useTranslations('layout.header.headerMenu.profileMenu')

    const router = useRouter()

    const { exit } = useAuth()

    const { user, isLoadingProfile } = useCurrentUser()

    const [logout] = useLogoutUserMutation({

        onCompleted() {

            exit()

            toast.success(t('successMessage'))

            router.push('/account/login')

        },

        onError() {

            toast.error(t('errorMessage'))

        }

    })

    return (

        <>

            <Notification />

            {isLoadingProfile || !user
                ?
                (
                    <Loader2 className='size-6 animate-spin text-muted-foreground' />
                )
                :
                (
                    <>

                        <DropdownMenu >

                            <DropdownMenuTrigger>

                                <ChannelAvatar channel={user} />

                            </DropdownMenuTrigger>

                            <DropdownMenuContent align='end' className='w-[230px]'>

                                <div className="flex items-center gap-x-3 p-2">

                                    <ChannelAvatar channel={user} />

                                    <h2 className='font-medium text-foreground'>{user.username}</h2>

                                </div>

                                <DropdownMenuSeparator />

                                <Link href={`${user.username}`}>

                                    <DropdownMenuItem>

                                        <User className='size-2 mr-2' />

                                        {t('channel')}

                                    </DropdownMenuItem>

                                </Link>

                                <Link href='/dashboard/settings'>

                                    <DropdownMenuItem>

                                        <LayoutDashboard className='size-2 mr-2' />

                                        {t('dashboard')}

                                    </DropdownMenuItem>

                                </Link>

                                <DropdownMenuItem onClick={() => logout()}>

                                    <LogOutIcon className='size-2 mr-2' />

                                    {t('logout')}

                                </DropdownMenuItem>


                            </DropdownMenuContent>

                        </DropdownMenu>

                    </>
                )
            }

        </>

    )

}

export default ProfileMenu