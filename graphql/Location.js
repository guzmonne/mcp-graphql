const graphql = require('graphql')
const InputTypes = require('./InputTypes.js')
const Interfaces = require('./Interfaces.js')

const GraphQLObjectType = graphql.GraphQLObjectType
const GraphQLID = graphql.GraphQLID
const GraphQLString = graphql.GraphQLString
const GraphQLFloat = graphql.GraphQLFloat
const GraphQLInt = graphql.GraphQLInt
const GraphQLNonNull = graphql.GraphQLNonNull
const GraphQLList = graphql.GraphQLList

const LocationType = new GraphQLObjectType({
  name: 'Location',
  fields: () => ({
    ID: {type: new GraphQLNonNull(GraphQLID)},
    Name: {type: GraphQLString},
    Lat: {type: GraphQLFloat},
    Lng: {type: GraphQLFloat},
    UpdatedAt: {type: GraphQLFloat},
    CreatedAt: {type: GraphQLFloat},
    APs: {
      type: require('./AP.js').Collection,
      args: {
        params: {type: InputTypes.Pagination}
      }
    },
    SessionLogs: {
      type: require('./SessionLog.js').Collection,
      args: {
        params: {type: InputTypes.Between}
      }
    }
  }),
})

const LocationCollection = new GraphQLObjectType({
  name: 'LocationCollection',
  implements: [Interfaces.Collection],
  fields: {
    List: {type: new GraphQLNonNull(new GraphQLList(LocationType))},
    Count: {type: GraphQLInt},
    LastEvaluatedKey: {type: GraphQLID},
  }
})

exports = module.exports = {
  Type: LocationType,
  Collection: LocationCollection,
}
