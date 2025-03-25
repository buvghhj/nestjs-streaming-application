'use client'

import { useVerifyAccountMutation } from "@/graphql/gennerated/output"
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"
import { AuthWrapper } from "../AuthWrapper"
import { Loader } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

const VerifyAccountForm = () => {

    const t = useTranslations('auth.verify')

    const { auth } = useAuth()

    const router = useRouter()

    const searchParams = useSearchParams()

    const token = searchParams.get('token') ?? ''

    const [verify] = useVerifyAccountMutation({

        onCompleted() {

            auth()

            toast.success(t('successMessage'))

            router.push('/dashboard/settings')

        },

        onError() {

            toast.error(t('errorMessage'))

        }

    })

    useEffect(() => {

        verify({

            variables: {

                data: {

                    token

                }

            }

        })

    }, [token])

    return (

        <AuthWrapper heading={t('heading')}>

            <div className="flex justify-center">

                <Loader className="size-8 animate-spin" />

            </div>

        </AuthWrapper>

    )

}

export default VerifyAccountForm