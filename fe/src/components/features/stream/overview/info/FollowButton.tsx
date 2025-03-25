'use client'

import { Button } from "@/components/ui/common/Button"
import { ConfirmModal } from "@/components/ui/elements/ConfirmModal"
import { FindChannelByUsernameQuery, useFindMyFollowingQuery, useFollowChannelMutation, useUnFollowChannelMutation } from "@/graphql/gennerated/output"
import { useAuth } from "@/hooks/useAuth"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { Heart, HeartCrack, HeartCrackIcon, HeartHandshake, HeartOff } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface FollowButtonProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

const FollowButton = ({ channel }: FollowButtonProps) => {

    const t = useTranslations('stream.actions.follow')

    const router = useRouter()

    const { isAuthenticated } = useAuth()

    const { user, isLoadingProfile } = useCurrentUser()

    const { data, loading: isLoadingFollowings, refetch } = useFindMyFollowingQuery({

        skip: !isAuthenticated

    })

    const followings = data?.findMyFollowings

    const [follow, { loading: isLoadingFollow }] = useFollowChannelMutation({

        onCompleted() {

            refetch()
            toast.success(t('successFollowMessage'))

        },

        onError() {

            toast.error(t('errorFollowMessage'))

        }

    })

    const [unFollow, { loading: isLoadingUnFollow }] = useUnFollowChannelMutation({

        onCompleted() {

            refetch()
            toast.success(t('successUnfollowMessage'))

        },

        onError() {

            toast.error(t('errorUnFollowMessage'))

        }

    })

    const isOwnerChannel = user?.id === channel.id

    const isExistingFollow = followings?.some(following => following.followingId === channel.id)

    if (isOwnerChannel || isLoadingProfile) {

        return null

    }

    const handleFollow = (channelId: string) => {

        follow({

            variables: {

                channelId: channelId

            }

        })

    }

    const handleUnFollow = (channelId: string) => {

        unFollow({

            variables: {

                channelId: channelId

            }

        })

    }

    return (

        <>

            {isExistingFollow ?
                (
                    <>

                        <ConfirmModal heading={t('confirmUnfollowHeading')} message={t('confirmUnfollowMessage')} onConfirm={() => handleUnFollow(channel.id)}>

                            <Button disabled={isLoadingFollowings || isLoadingUnFollow} variant='secondary'>

                                <HeartOff className="size-4" />

                                {t('unfollowButton')}

                            </Button>

                        </ConfirmModal>

                    </>
                )
                :
                (
                    <>

                        <Button onClick={() => isAuthenticated ? handleFollow(channel.id) : router.push('/account/login')} disabled={isLoadingFollowings || isLoadingFollow}>

                            <Heart className="size-4" />

                            {t('followButton')}

                        </Button>

                    </>
                )}

        </>

    )

}

export default FollowButton