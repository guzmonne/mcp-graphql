const graphql = require('graphql')
const AP = require('./AP.js')
const Location = require('./Location.js')
const Profile = require('./Profile.js')
const SessionLog = require('./SessionLog.js')

const GraphQLUnionType = graphql.GraphQLUnionType

exports.Model = new GraphQLUnionType({
  name: 'Model',
  types: [AP.Type, Profile.Type, Location.Type, SessionLog.Type],
})
