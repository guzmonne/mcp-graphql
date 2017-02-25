const fs = require('fs')
const path = require('path')
const GraphQLTools = require('graphql-tools')
const Resolvers = require('./resolver.js')

const Schema = fs.readFileSync(path.resolve(__dirname, './schema.gql'), {encoding: 'utf-8'})

exports = module.exports = GraphQLTools.makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
  logger: { log: (e) => console.log(e) },
  allowUndefinedInResolve: true,
})
