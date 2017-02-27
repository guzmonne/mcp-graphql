const graphql = require('graphql')
const Unions = require('./Unions.js')

const GraphQLObjectType = graphql.GraphQLObjectType
const GraphQLID = graphql.GraphQLID
const GraphQLString = graphql.GraphQLString
const GraphQLEnumType = graphql.GraphQLEnumType
const GraphQLFloat = graphql.GraphQLFloat
const GraphQLInt = graphql.GraphQLInt
const GraphQLNonNull = graphql.GraphQLNonNull
const GraphQLList = graphql.GraphQLList
const GraphQLSchema = graphql.GraphQLSchema
const GraphQLInputObjectType = graphql.GraphQLInputObjectType
const GraphQLUnionType = graphql.GraphQLUnionType
const GraphQLScalarType = graphql.GraphQLScalarType
const GraphQLInterfaceType = graphql.GraphQLInterfaceType

exports.Collection = new GraphQLInterfaceType({
  name: 'CollectionInterface',
  fields: {
    List: {type: new GraphQLNonNull(new GraphQLList(Unions.Model))},
    Count: {type: GraphQLInt},
    LastEvaluatedKey: {type: GraphQLID},
  }
})
