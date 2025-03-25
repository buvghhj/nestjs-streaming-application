import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'
import { SERVER_URL, WS_URL } from "../constants/url.constant";
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = createUploadLink({

    uri: SERVER_URL,

    credentials: 'include',

    headers: {

        'apollo-require-preflight': 'true'

    }

})

const wslink = new WebSocketLink({

    uri: WS_URL!,

    options: {

        reconnect: true

    }

})

const splitLink = split(({ query }) => {

    const definition = getMainDefinition(query)

    return (

        definition.kind === 'OperationDefinition' && definition.operation === 'subscription'

    )

}, wslink, httpLink)

export const client = new ApolloClient({

    link: splitLink,

    cache: new InMemoryCache()

})