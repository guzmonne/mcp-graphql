const graphql = require('graphql')

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

exports.Gender = new GraphQLEnumType({
  name: 'Gender',
  values: {
    male: {value: 0},
    female: {value: 1},
  }
})
