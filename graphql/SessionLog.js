const graphql = require('graphql')
const Enums = require('./Enums.js')
const InputTypes = require('./InputTypes.js')
const Interfaces = require('./Interfaces.js')

const GraphQLObjectType = graphql.GraphQLObjectType
const GraphQLID = graphql.GraphQLID
const GraphQLString = graphql.GraphQLString
const GraphQLFloat = graphql.GraphQLFloat
const GraphQLInt = graphql.GraphQLInt
const GraphQLNonNull = graphql.GraphQLNonNull
const GraphQLList = graphql.GraphQLList

const SessionLogType = new GraphQLObjectType({
  name: 'SessionLog',
  fields: () => ({
    ID: {type: new GraphQLNonNull(GraphQLID)},
    Client: {type: require('./Profile.js').Type},
    ClientID: {type: new GraphQLNonNull(GraphQLID)},
    Provider: {type: new GraphQLNonNull(GraphQLString)},
    ClientMac: {type: new GraphQLNonNull(GraphQLString)},
    Location: {type: require('./Location.js').Type},
    LocationID: {type: new GraphQLNonNull(GraphQLID)},
    LocationName: {type: new GraphQLNonNull(GraphQLString)},
    Gender: {type: Enums.Gender},
    Hour: {type: GraphQLInt},
    DayOfMonth: {type: GraphQLInt},
    DayOfYear: {type: GraphQLInt},
    Week: {type: GraphQLInt},
    Month: {type: GraphQLInt},
    Year: {type: GraphQLInt},
    Timestamp: {type: new GraphQLNonNull(GraphQLFloat)},
    LocationID: {type: new GraphQLNonNull(GraphQLID)},
    LocationName: {type: GraphQLString},
    Node: {type: require('./AP.js').Type},
    NodeMac: {type: new GraphQLNonNull(GraphQLString)},
    NodeName: {type: GraphQLString},
    Tags: {type: new GraphQLList(GraphQLString)},
    UpdatedAt: {type: GraphQLFloat},
    CreatedAt: {type: GraphQLFloat},
  }),
})

const SessionLogCollection = new GraphQLObjectType({
  name: 'SessionLogCollection',
  implements: [Interfaces.Collection],
  fields: {
    List: {type: new GraphQLNonNull(new GraphQLList(SessionLogType))},
    Count: {type: GraphQLInt},
    LastEvaluatedKey: {type: GraphQLID},
  }
})

exports = module.exports = {
  Type: SessionLogType,
  Collection: SessionLogCollection,
}
