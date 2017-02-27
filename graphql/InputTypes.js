const graphql = require('graphql')

const GraphQLID = graphql.GraphQLID
const GraphQLFloat = graphql.GraphQLFloat
const GraphQLInt = graphql.GraphQLInt
const GraphQLNonNull = graphql.GraphQLNonNull
const GraphQLList = graphql.GraphQLList
const GraphQLInputObjectType = graphql.GraphQLInputObjectType

exports.Between = new GraphQLInputObjectType({
  name: 'BetweenInput',
  fields: {
    years: {type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLInt)))},
    start: {type: new GraphQLNonNull(GraphQLFloat)},
    end: {type: new GraphQLNonNull(GraphQLFloat)},
  }
})

exports.Pagination = new GraphQLInputObjectType({
  name: 'PaginationInput',
  fields: {
    limit: {type: GraphQLInt},
    from: {type: GraphQLID}
  }
})