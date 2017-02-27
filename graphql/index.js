const graphql = require('graphql')
const GraphQLTools = require('graphql-tools')
const Resolvers = require('./resolver.js')
const Schema = require('./schema.js')

exports = module.exports = GraphQLTools.makeExecutableSchema({
  typeDefs: graphql.printSchema(Schema),
  resolvers: Resolvers,
  logger: { log: (e) => console.log(e) },
  allowUndefinedInResolve: true,
})
