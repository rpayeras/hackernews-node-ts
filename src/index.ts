import * as dotenv from 'dotenv'

import { ApolloServer } from 'apollo-server'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { context } from './context'

import { schema } from './schema'

dotenv.config()

export const server = new ApolloServer({
  schema,
  context
  // introspection: true,
  // plugins: [ApolloServerPluginLandingPageLocalDefault()]
})

const port = process.env.PORT || 3000

server.listen({ port }).then(({ url }) => {
  console.log(`Server listening at ${url}`)
})
