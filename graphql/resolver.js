const DocumentClient = require('../modules/Aws.js').DocumentClient
const Model = require('../modules/Model.js')
const TABLE_PREFIX = require('../variables.js').TABLE_PREFIX

/** HELPER FUNCTIONS */
/**
 * @function jtob
 * @description Converts an object to JSON and then encodes it on base64.
 * @param {Object} object Target to convert.
 * @returns {String} Target converted to JSON and encoded on base64.
 */
const jtob = (object) => (
  new Buffer(JSON.stringify(object || '')).toString('base64')
)
/**
 * @function btoj
 * @description Converts a base64 stored JSON object to a JS object.
 * @param {Strgin} base64string Target to convert.
 * @returns {Object} Decoded JS object.
 */
const btoj = (base64string) => (
  JSON.parse(new Buffer(base64string, 'base64').toString('ascii'))
)

/** MODELS */
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
/**
 * @function SessionLog.between
 * @description Gets items from the SessionLog table between different dates
 * @param {Object} params       Configuration object.
 * @param {Number} params.years List of years from which to query the table.
 * @param {Number} params.start Start date timestamp.
 * @param {Number} params.end   End date timestamp.
 * @param {String} params.name  Name of the parameter to filter by.
 * @param {Any}    params.value Value of the parameter to filter by
 * @return {Promise} Thenable promise with the result of the requests.
 */
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

/** RESOLVER FUNCTIONS */
exports = module.exports = {
  Query: {
    Locations: () => ({
      Collection: (args) => ( 
        Locations
        .scan(Object.assign(
          args && args.params ? args.params : {},
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
          args && args.params ? args.params : {},
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
          args && args.params ? args.params : {},
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
          args && args.params ? args.params : {},
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
  Profile: {
    SessionLogs: (profile, args) => (
      SessionLogs.between(Object.assign(
        args && args.params ? args.params : {}, 
      {
        name: 'ClientID',
        value: profile.ID,
      }))
    )
  },
  Location: {
    SessionLogs: (location, args) => (
      SessionLogs.between(Object.assign(
        args && args.params ? args.params : {}, 
      {
        name: 'LocationID',
        value: location.ID,
      }))
    ),
    APs: (location, args) => (
      APs.scan(Object.assign({
        expression: '#LocationID = :locationID',
        names: {
          '#LocationID': 'LocationID',
        },
        values: {
          ':locationID': location.ID,
        },
      }, 
        args.params
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
    SessionLogs: (ap, args) => (
      SessionLogs.between(Object.assign(
        args && args.params ? args.params : {}, 
      {
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
}
