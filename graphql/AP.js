const graphql = require('graphql')
const InputTypes = require('./InputTypes.js')
const Interfaces = require('./Interfaces.js')
const SessionLog = require('./SessionLog.js')

const GraphQLObjectType = graphql.GraphQLObjectType
const GraphQLID = graphql.GraphQLID
const GraphQLString = graphql.GraphQLString
const GraphQLFloat = graphql.GraphQLFloat
const GraphQLInt = graphql.GraphQLInt
const GraphQLNonNull = graphql.GraphQLNonNull
const GraphQLList = graphql.GraphQLList

const APType = new GraphQLObjectType({
  name: 'AP',
  fields: () => ({
    ID: {type: new GraphQLNonNull(GraphQLID)},
    Mac: {type: new GraphQLNonNull(GraphQLString)},
    Name: {type: GraphQLString},
    Location: {type: require('./Location.js').Type},
    LocationID: {type: new GraphQLNonNull(GraphQLID)},
    LocationName: {type: new GraphQLNonNull(GraphQLString)},
    Tags: {type: new GraphQLList(GraphQLString)},
    UpdatedAt: {type: GraphQLFloat},
    CreatedAt: {type: GraphQLFloat},
    SessionLogs: {
      type: SessionLog.Collection,
      args: {
        params: {type: InputTypes.Between}
      }
    }
  }),
})

const APCollection = new GraphQLObjectType({
  name: 'APCollection',
  implements: [Interfaces.Collection],
  fields: {
    List: {type: new GraphQLNonNull(new GraphQLList(APType))},
    Count: {type: GraphQLInt},
    LastEvaluatedKey: {type: GraphQLID},
  }
})

exports = module.exports = {
  Type: APType,
  Collection: APCollection,
}
