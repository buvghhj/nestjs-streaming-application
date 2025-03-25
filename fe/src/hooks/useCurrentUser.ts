import { useClearSessionCookieMutation, useFindProfileQuery } from "@/graphql/gennerated/output"
import { useAuth } from "./useAuth"
import { useEffect } from "react"

export const useCurrentUser = () => {

    const { isAuthenticated, exit } = useAuth()

    const { data, loading, refetch, error } = useFindProfileQuery({

        skip: !isAuthenticated

    })

    const [clear] = useClearSessionCookieMutation()

    useEffect(() => {

        if (error) {

            if (isAuthenticated) {

                clear()

            }

            exit()

        }

    }, [isAuthenticated, clear, exit])

    return {

        user: data?.findProfile,
        isLoadingProfile: loading,
        refetch
    }

}