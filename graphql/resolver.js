const DocumentClient = require('../modules/Aws.js').DocumentClient
const Model = require('../modules/Model.js')
const TABLE_PREFIX = require('../variables.js').TABLE_PREFIX

const log = (v) => {
  console.log(v)
  return v
}

const Locations = Model({
  Table: TABLE_PREFIX + 'locations',
  HashKey: 'ID',
  DocumentClient: DocumentClient,
})

const APs = Model({
  Table: TABLE_PREFIX + 'aps',
  HashKey: 'Mac',
  DocumentClient: DocumentClient,
})

const Profiles = Model({
  Table: TABLE_PREFIX + 'profiles',
  HashKey: 'ID',
  RangeKey: 'Provider',
  DocumentClient: DocumentClient,
})

const SessionLogs = Model({
  Table: TABLE_PREFIX + 'session-logs',
  HashKey: 'ID',
  DocumentClient: DocumentClient,
})

const jtob = (string) => (
  new Buffer(JSON.stringify(string || '')).toString('base64')
)

const btoj = (base64string) => (
  JSON.parse(new Buffer(base64string, 'base64').toString('ascii'))
)

SessionLogs.between = (params) => (
  Promise
  .all(
    params.years
    .map(year => (
      SessionLogs
      .query(Object.assign({
        expression: `#Year = :year and #Timestamp BETWEEN :start AND :end`,
        indexName: 'Timestamp-Index',
        names: Object.assign({
          '#Year': 'Year',
          '#Timestamp': 'Timestamp'
        }, 
          params.name && params.value ? {'#Filter': params.name} : {}
        ),
        values: Object.assign({
          ':year': year,
          ':start': params.start ? params.start : Date.now() - 1000 * 60 * 60 * 24 * 7,
          ':end': params.end ? params.end : Date.now(),
        }, 
          params.name && params.value ? {':filter': params.value} : {}
        )
      }, 
        params.name && params.value ? {filter: '#Filter = :filter'} : {}
      ))
    ))
  )
  .then(responses => ({
    List: responses
          .map(response => response.Items)
          .reduce((acc, result) => acc.concat(result), []),
    Count: responses.reduce((acc, response) => acc + response.Items.length, 0),
    LastEvaluatedKey: responses.map(response => response.LastEvaluatedKey
                                                 ? jtob(response.LastEvaluatedKey)
                                                 : undefined),
  }))
)

const resolveFunctions = {
  Query: {
    Locations: () => ( 
      Locations
      .scan()
      .then(response => response.Items)
    ),
    APs: () => ( 
      APs
      .scan()
      .then(response => response.Items)
    ),
    Profiles: () => ( 
      Profiles
      .scan()
      .then(response => response.Items)      
    ),
    SessionLogs: (_, query) => (
      SessionLogs.between(query.params)
    ),
  },
  Profile: {
    SessionLogs: (profile, query) => (
      SessionLogs.between(Object.assign(query.params, {
        name: 'ClientID',
        value: profile.ID,
      }))
    )
  },
  Location: {
    SessionLogs: (location, query) => (
      SessionLogs.between(Object.assign(query.params, {
        name: 'LocationID',
        value: location.ID,
      }))
    ),
    APs: (location, query) => (
      APs.scan(Object.assign({
        expression: '#LocationID = :locationID',
        names: {
          '#LocationID': 'LocationID',
        },
        values: {
          ':locationID': location.ID,
        },
      }, 
        query && query.params && query.params.limit ? {limit: query.params.limit} : {},
        query && query.params && query.params.from ? {startKey: btoj(query.params.from)} : {}
      ))
      .then(response => ({
        List: response.Items,
        Count: response.Items.length,
        LastEvaluatedKey: response.LastEvaluatedKey
                          ? [jtob(response.LastEvaluatedKey)]
                          : [undefined],
      }))
    )
  },
  AP: {
    Location: (ap) => (
      Locations
      .get(ap.LocationID)
      .then(response => response.Item)
    ),
    SessionLogs: (ap, query) => (
      SessionLogs.between(Object.assign(query.params, {
        name: 'NodeMac',
        value: ap.Mac,
      }))
    )
  },
  SessionLog: {
    Client: (log) => (
      Profiles
      .get(log.ClientID, log.Provider)
      .then(response => response.Item)
    ),
    Node: (log) => (
      APs
      .get(log.NodeMac)
      .then(response => response.Item)
    ),
    Location: (log) => (
      Locations
      .get(log.LocationID)
      .then(response => response.Item)
    )
  }
  /*
  Mutation: {
    UpvotePost(_, {ID}){
      return DB.Posts.upvote(ID)
    }
  },
  */
}

exports = module.exports = {
  Query: {
    Locations: () => ({
      Collection: (args) => ( 
        Locations
        .scan(Object.assign(
          args.params,
          args.params && args.params.from 
            ? {from: btoj(args.params.from)}
            : {}
        ))
        .then(response => ({
          List: response.Items,
          Count: response.Items.length,
          LastEvaluatedKey: [jtob(response.LastEvaluatedKey)],
        }))      
      ),
      Model: (args) => (
        Locations
        .get(btoj(args.id).ID)
        .then(response => response.Item)
      )
    }),
    Profiles: () => ({
      Collection: (args) => ( 
        Profiles
        .scan(Object.assign(
          args.params,
          args.params && args.params.from 
            ? {from: btoj(args.params.from)}
            : {}
        ))
        .then(response => ({
          List: response.Items,
          Count: response.Items.length,
          LastEvaluatedKey: [jtob(response.LastEvaluatedKey)],
        }))      
      ),
      Model: (args) => (
        Profiles
        .get(btoj(args.id).ID, btoj(args.id).Provider)
        .then(response => response.Item)
      )
    }),
    APs: () => ({
      Collection: (args) => ( 
        APs
        .scan(Object.assign(
          args.params,
          args.params && args.params.from 
            ? {from: btoj(args.params.from)}
            : {}
        ))
        .then(response => ({
          List: response.Items,
          Count: response.Items.length,
          LastEvaluatedKey: [jtob(response.LastEvaluatedKey)],
        }))      
      ),
      Model: (args) => (
        APs
        .get(btoj(args.id).Mac)
        .then(response => response.Item)
      )
    }),
    SessionLogs: () => ({
      Collection: (args) => ( 
        SessionLogs
        .scan(Object.assign(
          args.params,
          args.params && args.params.from 
            ? {from: btoj(args.params.from)}
            : {}
        ))
        .then(response => ({
          List: response.Items,
          Count: response.Items.length,
          LastEvaluatedKey: [jtob(response.LastEvaluatedKey)],
        }))      
      ),
      Model: (args) => (
        SessionLogs
        .get(btoj(args.id).ID)
        .then(response => response.Item)
      ),
      Between: (args) => SessionLogs.between(args.params)
    }),
  },
}
