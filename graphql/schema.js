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

const Gender = new GraphQLEnumType({
  name: 'Gender',
  values: {
    male: {value: 0},
    female: {value: 1},
  }
})

const BetweenInputType = new GraphQLInputObjectType({
  name: 'BetweenInput',
  fields: {
    years: {type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLInt)))},
    start: {type: new GraphQLNonNull(GraphQLFloat)},
    end: {type: new GraphQLNonNull(GraphQLFloat)},
  }
})

const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    ID: {type: new GraphQLNonNull(GraphQLID)},
    Provider: {type: new GraphQLNonNull(GraphQLString)},
    Name: {type: GraphQLString},
    Email: {type: GraphQLString},
    Gender: {type: Gender},
    Age: {type: GraphQLString},
    UpdatedAt: {type: GraphQLFloat},
    CreatedAt: {type: GraphQLFloat},
    DeviceMac: {type: GraphQLString},
    Document: {type: GraphQLString},
    Picture: {type: GraphQLString},
  },
  isTypeOf: (data) => data.Provider && data.Email
})

const LocationType = new GraphQLObjectType({
  name: 'Location',
  fields: {
    ID: {type: new GraphQLNonNull(GraphQLID)},
    Name: {type: GraphQLString},
    Lat: {type: GraphQLFloat},
    Lng: {type: GraphQLFloat},
    UpdatedAt: {type: GraphQLFloat},
    CreatedAt: {type: GraphQLFloat},
  },
  isTypeOf: (data) => data.Lat && data.Lng
})

const APType = new GraphQLObjectType({
  name: 'AP',
  fields: {
    ID: {type: new GraphQLNonNull(GraphQLID)},
    Mac: {type: new GraphQLNonNull(GraphQLString)},
    Name: {type: GraphQLString},
    LocationID: {type: new GraphQLNonNull(GraphQLID)},
    LocationName: {type: new GraphQLNonNull(GraphQLString)},
    Tags: {type: new GraphQLList(GraphQLString)},
    UpdatedAt: {type: GraphQLFloat},
    CreatedAt: {type: GraphQLFloat},
  },
  isTypeOf: (data) => data.Mac && data.ID
})

const SessionLogType = new GraphQLObjectType({
  name: 'SessionLog',
  fields: {
    ID: {type: new GraphQLNonNull(GraphQLID)},
    ClientID: {type: new GraphQLNonNull(GraphQLID)},
    Provider: {type: new GraphQLNonNull(GraphQLString)},
    ClientMac: {type: new GraphQLNonNull(GraphQLString)},
    LocationID: {type: new GraphQLNonNull(GraphQLID)},
    LocationName: {type: new GraphQLNonNull(GraphQLString)},
    Gender: {type: Gender},
    Hour: {type: GraphQLInt},
    DayOfMonth: {type: GraphQLInt},
    DayOfYear: {type: GraphQLInt},
    Week: {type: GraphQLInt},
    Month: {type: GraphQLInt},
    Year: {type: GraphQLInt},
    Timestamp: {type: new GraphQLNonNull(GraphQLFloat)},
    LocationID: {type: new GraphQLNonNull(GraphQLID)},
    LocationName: {type: GraphQLString},
    NodeMac: {type: new GraphQLNonNull(GraphQLString)},
    NodeName: {type: GraphQLString},
    Tags: {type: new GraphQLList(GraphQLString)},
    UpdatedAt: {type: GraphQLFloat},
    CreatedAt: {type: GraphQLFloat},
  },
  isTypeOf: (data) => data.Timestamp && data.ID
})

const Model = new GraphQLUnionType({
  name: 'Model',
  types: [APType, ProfileType, LocationType, SessionLogType],
})

const CollectionType = new GraphQLObjectType({
  name: 'Collection',
  fields: {
    List: {type: new GraphQLNonNull(new GraphQLList(Model))},
    Count: {type: new GraphQLNonNull(GraphQLInt)},
    LastEvaluatedKey: {type: new GraphQLList(GraphQLID)}
  }
})

const CollectionInterface = new GraphQLInterfaceType({
  name: 'CollectionInterface',
  fields: {
    List: {type: new GraphQLNonNull(new GraphQLList(Model))},
    Count: {type: GraphQLInt},
    LastEvaluatedKey: {type: GraphQLID},
  }
})

const ProfileCollection = new GraphQLObjectType({
  name: 'ProfileCollection',
  implements: [CollectionInterface],
  fields: {
    List: {type: new GraphQLNonNull(new GraphQLList(ProfileType))},
    Count: {type: GraphQLInt},
    LastEvaluatedKey: {type: GraphQLID},
  }
})

const APCollection = new GraphQLObjectType({
  name: 'APCollection',
  implements: [CollectionInterface],
  fields: {
    List: {type: new GraphQLNonNull(new GraphQLList(APType))},
    Count: {type: GraphQLInt},
    LastEvaluatedKey: {type: GraphQLID},
  }
})

const LocationCollection = new GraphQLObjectType({
  name: 'LocationCollection',
  implements: [CollectionInterface],
  fields: {
    List: {type: new GraphQLNonNull(new GraphQLList(LocationType))},
    Count: {type: GraphQLInt},
    LastEvaluatedKey: {type: GraphQLID},
  }
})

const SessionLogCollection = new GraphQLObjectType({
  name: 'SessionLogCollection',
  implements: [CollectionInterface],
  fields: {
    List: {type: new GraphQLNonNull(new GraphQLList(SessionLogType))},
    Count: {type: GraphQLInt},
    LastEvaluatedKey: {type: GraphQLID},
  }
})

const PaginationInputType = new GraphQLInputObjectType({
  name: 'PaginationInput',
  fields: {
    limit: {type: GraphQLInt},
    from: {type: GraphQLID}
  }
})

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    Profiles: {
      type: new GraphQLObjectType({
        name: 'Profiles',
        fields: {
          Collection: {
            type: ProfileCollection,
            args: {
              params: {type: PaginationInputType}
            }
          },
          Model: {
            type: ProfileType,
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
            type: APCollection,
            args: {
              params: {type: PaginationInputType}
            }
          },
          Model: {
            type: APType,
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
            type: LocationCollection,
            args: {
              params: {type: PaginationInputType}
            }
          },
          Model: {
            type: LocationType,
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
            type: SessionLogCollection,
            args: {
              params: {type: PaginationInputType}
            }
          },
          Model: {
            type: SessionLogType,
            args: {
              id: {type: GraphQLID}
            }
          },
          Between: {
            type: SessionLogCollection,
            args: {
              params: {type: BetweenInputType}
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