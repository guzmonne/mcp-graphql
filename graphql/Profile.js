const graphql = require('graphql')
const Enums = require('./Enums.js')
const Interfaces = require('./Interfaces.js')
const InputTypes = require('./InputTypes.js')
const SessionLog = require('./SessionLog.js')

const GraphQLObjectType = graphql.GraphQLObjectType
const GraphQLID = graphql.GraphQLID
const GraphQLString = graphql.GraphQLString
const GraphQLFloat = graphql.GraphQLFloat
const GraphQLInt = graphql.GraphQLInt
const GraphQLNonNull = graphql.GraphQLNonNull
const GraphQLList = graphql.GraphQLList

const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    ID: {type: new GraphQLNonNull(GraphQLID)},
    Provider: {type: new GraphQLNonNull(GraphQLString)},
    Name: {type: GraphQLString},
    Email: {type: GraphQLString},
    Gender: {type: Enums.Gender},
    Age: {type: GraphQLString},
    UpdatedAt: {type: GraphQLFloat},
    CreatedAt: {type: GraphQLFloat},
    DeviceMac: {type: GraphQLString},
    Document: {type: GraphQLString},
    Picture: {type: GraphQLString},
    SessionLogs: {
      type: SessionLog.Collection,
      args: {
        params: {type: InputTypes.Between}
      }
    }
  }),
})

const ProfileCollection = new GraphQLObjectType({
  name: 'ProfileCollection',
  implements: [Interfaces.Collection],
  fields: {
    List: {type: new GraphQLNonNull(new GraphQLList(ProfileType))},
    Count: {type: GraphQLInt},
    LastEvaluatedKey: {type: GraphQLID},
  }
})

exports = module.exports = {
  Type: ProfileType,
  Collection: ProfileCollection,
}