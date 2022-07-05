import { extendType, objectType, nonNull, stringArg, idArg } from 'nexus'
// import { NexusGenObjects } from '../../nexus-typegen'

export const Link = objectType({
  name: 'Link',
  definition (t) {
    t.nonNull.int('id')
    t.nonNull.string('description')
    t.nonNull.string('url')
    t.field('postedBy', {
      type: 'User',
      resolve (parent, args, context) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .postedBy()
      }
    })
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
    t.nonNull.list.nonNull.field('feed', {
      type: 'Link',
      resolve (parent, args, context, info) {
        return context.prisma.link.findMany()
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
