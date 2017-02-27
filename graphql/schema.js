const graphql = require('graphql')
const InputTypes = require('./InputTypes.js')
const Profile = require('./Profile.js')
const AP = require('./AP.js')
const Location = require('./Location.js')
const SessionLog = require('./SessionLog.js')

const GraphQLObjectType = graphql.GraphQLObjectType
const GraphQLID = graphql.GraphQLID
const GraphQLSchema = graphql.GraphQLSchema

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    Profiles: {
      type: new GraphQLObjectType({
        name: 'Profiles',
        fields: {
          Collection: {
            type: Profile.Collection,
            args: {
              params: {type: InputTypes.Pagination}
            }
          },
          Model: {
            type: Profile.Type,
            args: {
              id: {type: GraphQLID}
            }
          }
        }
      })
    },
    APs: {
      type: new GraphQLObjectType({
        name: 'APs',
        fields: {
          Collection: {
            type: AP.Collection,
            args: {
              params: {type: InputTypes.Pagination}
            }
          },
          Model: {
            type: AP.Type,
            args: {
              id: {type: GraphQLID}
            }
          }
        }
      })
    },
    Locations: {
      type: new GraphQLObjectType({
        name: 'Locations',
        fields: {
          Collection: {
            type: Location.Collection,
            args: {
              params: {type: InputTypes.Pagination}
            }
          },
          Model: {
            type: Location.Type,
            args: {
              id: {type: GraphQLID}
            }
          }
        }
      })
    },
    SessionLogs: {
      type: new GraphQLObjectType({
        name: 'SessionLogs',
        fields: {
          Collection: {
            type: SessionLog.Collection,
            args: {
              params: {type: InputTypes.Pagination}
            }
          },
          Model: {
            type: SessionLog.Type,
            args: {
              id: {type: GraphQLID}
            }
          },
          Between: {
            type: SessionLog.Collection,
            args: {
              params: {type: InputTypes.Between}
            }
          }
        }
      })
    },
  }
})

exports = module.exports = new GraphQLSchema({
  query: Query,
});