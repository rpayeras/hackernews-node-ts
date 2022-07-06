import { Prisma } from '.prisma/client'
import { extendType, objectType, nonNull, stringArg, idArg, intArg, inputObjectType, enumType, arg, list } from 'nexus'
// import { NexusGenObjects } from '../../nexus-typegen'

export const Link = objectType({
  name: 'Link',
  definition (t) {
    t.nonNull.int('id')
    t.nonNull.string('description')
    t.nonNull.string('url')
    t.nonNull.dateTime('createdAt')
    t.field('postedBy', {
      type: 'User',
      resolve (parent, args, context) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .postedBy()
      }
    })
    t.nonNull.list.nonNull.field('voters', {
      type: 'User',
      resolve (parent, args, context) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .voters()
      }
    })
  }
})

export const Feed = objectType({
  name: 'Feed',
  definition (t) {
    t.nonNull.list.nonNull.field('links', { type: Link })
    t.nonNull.int('count')
    t.id('id')
  }
})
// const links: NexusGenObjects['Link'][] = [
//   {
//     id: 1,
//     url: 'www.google.es',
//     description: 'Fullstack tutorial'
//   },
//   {
//     id: 2,
//     url: 'https://www.google.es',
//     description: 'Graphql official website'
//   }
// ]

export const LinkQuery = extendType({
  type: 'Query',
  definition (t) {
    t.nonNull.field('feed', {
      type: 'Feed',
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(LinkOrderByInput)) })
      },
      async resolve (parent, args, context, info) {
        const where = args.filter
          ? {
              OR: [
                { description: { contains: args.filter } },
                { url: { contains: args.filter } }
              ]
            }
          : {}

        const links = context.prisma.link.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.skip as number | undefined,
          orderBy: args?.orderBy as Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput> | undefined
        })

        const count = await context.prisma.link.count({ where })
        const id = `main-feed:${JSON.stringify(args)}`

        return {
          links,
          count,
          id
        }
      }
    })
  }
})

export const SingleLinkQuery = extendType({
  type: 'Query',
  definition (t) {
    t.field('link', {
      type: 'Link',
      args: {
        id: nonNull(idArg())
      },
      resolve (parent, args, context, info) {
        const { id } = args

        return context.prisma.link.findFirst({
          where: { id: Number(id) }
        })
      }
    })
  }
})

export const LinkMutation = extendType({
  type: 'Mutation',
  definition (t) {
    t.nonNull.field('post', {
      type: 'Link',
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg())
      },
      resolve (parent, args, context) {
        const { description, url } = args
        const { userId } = context

        if (!userId) {
          throw new Error('Cannot post without loggin in')
        }

        return context.prisma.link.create({
          data: {
            description,
            url,
            postedBy: { connect: { id: userId } }
          }
        })
      }
    })
  }
})

export const LinkUpdateMutation = extendType({
  type: 'Mutation',
  definition (t) {
    t.nonNull.field('update', {
      type: 'Link',
      args: {
        id: nonNull(idArg()),
        description: nonNull(stringArg()),
        url: nonNull(stringArg())
      },
      resolve (parent, args, context) {
        const { id, description, url } = args

        return context.prisma.link.update({
          where: { id: Number(id) },
          data: { description, url }
        })
      }
    })
  }
})

export const LinkDeleteMutation = extendType({
  type: 'Mutation',
  definition (t) {
    t.nonNull.field('delete', {
      type: 'Link',
      args: {
        id: nonNull(idArg())
      },
      resolve (parent, args, context) {
        const { id } = args

        return context.prisma.link.delete({
          where: { id: Number(id) }
        })
      }
    })
  }
})

export const LinkOrderByInput = inputObjectType({
  name: 'LinkOrderByInput',
  definition (t) {
    t.field('description', { type: Sort })
    t.field('url', { type: Sort })
    t.field('createdAt', { type: Sort })
  }
})

export const Sort = enumType({
  name: 'Sort',
  members: ['asc', 'desc']
})
