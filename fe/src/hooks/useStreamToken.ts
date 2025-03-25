import { useEffect, useState } from "react"
import { useAuth } from "./useAuth"
import { useCurrentUser } from "./useCurrentUser"
import { useGenerateStreamTokenMutation } from "@/graphql/gennerated/output"
import { jwtDecode, JwtPayload } from 'jwt-decode'
import { toast } from "sonner"
import { v4 as uuid4 } from 'uuid'

const useStreamToken = (channelId: string) => {

    const [token, setToken] = useState('')

    const [name, setName] = useState('')

    const [identity, setIdentity] = useState('')

    const { isAuthenticated } = useAuth()

    const { user } = useCurrentUser()

    const [generateStreamToken] = useGenerateStreamTokenMutation({

        onCompleted(data) {

            const viewerToken = data.generateStreamToken.token

            setToken(viewerToken)

            const decodedToken = jwtDecode(viewerToken) as JwtPayload & { name?: string }

            const name = decodedToken.name

            const identity = decodedToken.jti

            if (name) {

                setName(name)

            }

            if (identity) {

                setIdentity(identity)

            }

        },

        onError(error) {

            toast.error(error.message)

        }

    })

    useEffect(() => {

        const generateToken = async () => {

            const userId = isAuthenticated && user ? user.id : uuid4()

            await generateStreamToken({

                variables: {

                    data: {

                        userId,
                        channelId

                    }

                }

            })

        }

        const timeoutId = setTimeout(generateToken, 1000)

        return () => clearTimeout(timeoutId)

    }, [generateStreamToken, isAuthenticated, user, channelId])

    return { token, name, identity }

}

export default useStreamToken