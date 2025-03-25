'use client'

import { Button } from "@/components/ui/common/Button"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/common/Dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/common/Tabs"
import { FindChannelByUsernameQuery, useFindSponsorByChannelQuery, useMakePaymentPlanMutation } from "@/graphql/gennerated/output"
import { useAuth } from "@/hooks/useAuth"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { Medal } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface SupportButtonProps {
    channel: FindChannelByUsernameQuery['findChannelByUsername']
}

const SupportButton = ({ channel }: SupportButtonProps) => {

    const t = useTranslations('stream.actions.support')

    const router = useRouter()

    const { isAuthenticated } = useAuth()

    const { user, isLoadingProfile } = useCurrentUser()

    const { data } = useFindSponsorByChannelQuery({

        variables: {

            channelId: channel.id

        }

    })

    const [makePayment, { loading: isLoadingPayment }] = useMakePaymentPlanMutation({

        onCompleted(data) {

            router.push(data.makePaymentPlan.url)

        },

        onError() {

            toast.error(t('errorMessage'))

        }

    })

    const sponsors = data?.findSponsorByChannel

    const isSponsor = sponsors?.some(sponsor => sponsor.user.id === user?.id)

    const isOwnerChannel = user?.id === channel.id

    if (isOwnerChannel || isLoadingProfile) {

        return null

    }

    if (isSponsor) {

        return (

            <Button variant='secondary' disabled>

                <Medal className="size-4" />
                {t('alreadySponsor')}

            </Button>

        )

    }

    const onPayment = (planId: string) => {

        makePayment({

            variables: {

                planId: planId

            }

        })

    }

    return (

        <>

            {isAuthenticated ?
                (
                    <>

                        <Dialog>

                            <DialogTrigger asChild>

                                <Button variant='secondary'>

                                    <Medal className="size-4" />
                                    {t('supportAuthor')}

                                </Button>

                            </DialogTrigger>

                            <DialogContent className="py-12 px-4">

                                <Tabs defaultValue={channel.sponsorshipPlans[0].id} >

                                    <TabsList className="mb-3 flex overflow-x-auto whitespace-nowrap">

                                        {channel.sponsorshipPlans.map((plan, index) =>

                                        (

                                            <TabsTrigger key={index} value={plan.id}>{plan.title}</TabsTrigger>

                                        )

                                        )}

                                    </TabsList>

                                    {channel.sponsorshipPlans.map((plan, index) => (

                                        <TabsContent key={index} value={plan.id} className="mt-5" >

                                            <DialogTitle className="text-2xl">

                                                {plan.price}.00 ${t('perMonth')}

                                            </DialogTitle>

                                            {plan.description && (
                                                <DialogDescription className="mt-4 text-sm">

                                                    {plan.description}

                                                </DialogDescription>
                                            )}

                                            <Button disabled={isLoadingPayment} onClick={() => onPayment(plan.id)} className="mt-7 w-full">{t('choose')}</Button>

                                        </TabsContent>

                                    ))}

                                </Tabs>

                            </DialogContent>

                        </Dialog >

                    </>
                )
                :
                (
                    <Button onClick={() => router.push('/account/login')} variant='secondary'>

                        <Medal className="size-4" />
                        {t('supportAuthor')}
                    </Button>
                )
            }

        </>

    )

}

export default SupportButton