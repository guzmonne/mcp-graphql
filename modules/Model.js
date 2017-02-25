/**
 * @constructor Model
 * @description Constructs a Model object that provides simplified methods to 
 *              interact with a DynamoDB table. Every method returns a promise.
 * @param {Object} config Model configuration object.
 * @param {String!}  config.Table          DynamoDB table name.
 * @param {String!}  config.HashKey        DynamoDB table hash key.
 * @param {String}   config.RangeKey       DynamoDB table range key.
 * @param {Object!}  config.DocumentClient A valid DocumentClient object with access to
 *                                  the tables.
 * @returns {Object} Model with access to the DynamoDB table.
 */
function Model(config) {
  // Configuration Parameters
  // ------------------------
  const Table = config.Table
  const HashKey = config.HashKey
  const RangeKey = config.RangeKey
  const DocumentClient = config.DocumentClient
  // Configuration Error Handling
  if (!Table)
    throw new Error('Table must be defined')
  if (!HashKey)
    throw new Error('HashKey must be defined')
  if (!DocumentClient)
    throw new Error('DocumentClient must be defined')
  // Private Functions
  // -----------------
  /**
   * @function buildKey
   * @description Builds and object representing the item's key.
   * @param {String!} hash  The item's Hash Key value.
   * @param {String}  range The item's Ranger Key value.
   * @returns {Object} The correctly formated key for a given item.
   */
  const buildKey = (hash, range) => (
    Object.assign(
      {}, 
      {[HashKey]: hash},
      RangeKey ? {[RangeKey]: range} : {}
    )
  )
  /**
   * @function buildUpdateExpression
   * @description Builds an UpdateExpression from an item object.
   * @param {Object} item Item from wich to create the update expression.
   * @returns {String} Resulting update expression.
   */
  const buildUpdateExpression = (item) => (
    Object
    .keys(item)
    .reduce((acc, key, index) => (
      index === 0 ? `set #${key} = :${key}` : `, #${key} = :${key}`
    ), '')
  )
  /**
   * @function buildUpdateAttributeNames
   * @description Builds a dictionary of names used on the default update expression.
   * @param {Object} item Item from wich to create the update expression.
   * @returns {Object} Update expression names dictionary.
   */
  const buildUpdateAttributeNames = (item) => (
    Object
    .keys(item)
    .reduce((acc, key) => Object.assign(acc, {
      [`#${key}`]: key
    }), {})
  )
  /**
   * @function buildUpdateAttributeValues
   * @description Builds a dictionary of values used on the default update expression.
   * @param {Object} item Item from wich to create the update expression.
   * @returns {Object} Update expression values dictionary.
   */
  const buildUpdateAttributeValues = (item) => (
    Object
    .keys(item)
    .reduce((acc, key) => Object.assign(acc, {
      [`:${key}`]: item[key]
    }), {})
  )
  // Public Functions
  // ----------------
  /**
   * @function _get
   * @description Gets an item from the table.
   * @param {String} hash  Item's HashKey.
   * @param {String} range Item's RangeKey.
   * @returns {Promise} Thenable promise with the results of the get request.
   */
  const _get = (hash, range) => (
    !hash || (RangeKey && !range) 
    ? !hash ? Promise.reject('Invalid hash key.') 
            : Promise.reject('Invalid range key.') 
    : DocumentClient
      .get({
        TableName: Table,
        Key: buildKey(hash, range),
      })
      .promise()
  )
  /**
   * @function _delete
   * @description Deletes an item from the table.
   * @param {String} hash  Item's HashKey.
   * @param {String} range Item's RangeKey.
   * @returns {Promise} Thenable promise with the results of the delete request.
   */
  const _delete = (hash, range) => (
    !hash || (RangeKey && !range) 
    ? !hash ? Promise.reject('Invalid hash key.') 
            : Promise.reject('Invalid range key.')  
    : DocumentClient
      .delete({
        TableName: Table,
        Key: buildKey(hash, range),
      })
      .promise()
  )
  /**
   * @function _put
   * @description Puts an item on the table.
   * @param {Object} item An object representing the item to insert on the table.
   *                      Must include the corresponding keys.
   *                      If the item indicated by the keys does not exists it creates it, else
   *                      it will override the existing one.
   * @returns {Promise} Thenable promise with the result of the put request.
   */
  const _put = (item) => (
    !item 
    ? Promise.reject('Item is undefined') 
    : DocumentClient
      .put({
        TableName: Table,
        Item: item,
      })
      .promise()
  )
  /**
   * @function _update
   * @description Updates or inserts an item on the table. More complex actions can be done
   *              by customizing the update expression value.
   * @param {String} hash   Item's HashKey.
   * @param {String} range  Item's RangeKey.
   * @param {Object} item   An object representing the item to insert on the table.
   * @param {Object} params Update params configuration options for more advanced actions.
   * @param {String}  expression Update expression for more control of the update action.
   * @param {Object}  names      Dictionary of all the key names used on the expression.
   *                             If not set, an effort will be done to create them from the item.
   * @param {Object}  values     Dictionary of all the values used on the expression.
   *                             If not set, an effort will be done to create them from the item.
   */
  const _update = (hash, range, item, params) => (
    !hash || (RangeKey && !range)
    ? !hash ? Promise.reject('Invalid hash key.') 
            : Promise.reject('Invalid range key.') 
    : DocumentClient
      .update({
        TableName: Table,
        Key: buildKey(hash, range),
        UpdateExpression: (params && params.expression) || buildUpdateExpression(item),
        ExpressionAttributeNames: (params && params.names) || buildUpdateAttributeNames(item),
        ExpressionAttributeValues: (params && params.values) || buildUpdateAttributeValues(item),
      })
      .promise()
  )
  /**
   * @function _query
   * @description Queries the table according to the given expression.
   *              The results can also be:
   *              - Limited: Using the query limit attribute.
   *              - Indexed: Run on an index indicated by the indexName query attribute.
   *              - Picked: Only fields inculded in the query attributes attribute will be returned.
   *              Is important to take into account that the query expression must be provided
   *              to this function. In it, the HashKey will be referred to as #HashKey and the 
   *              RangeKey as #RangeKey. The different values used inside the expression must be
   *              defined through a name defined on the query values attribute.
   * @example 
   *  // exoression and value are the only required parameters.
   *  Model.query({
   *    expression: '#HashKey = :hkey and #RangeKey > :rkey',
   *    values: {
   *      ':hkey': 'SomeKeyValue',
   *      ':rkey': 'SomeRangeValue',
   *    }
   *  })
   * @param {Object}  params Query configuration object. 
   * @param {String!} params.expression Expression complying with all KeyConditionExpression rules.
   * @param {String}  params.filter     Expression to filter DynamoDB results.
   * @param {Object}  params.names      Dictionary of all the names ysed on the expression and filter attributes.
   * @param {Object}  params.values     Dictionary of all the named values used on the expression and filter attribute.
   * @param {Array}   params.attributes List of attributes to pick from the responses.
   * @param {Object}  params.startKey   Key indicating where the query should start looking on the table.
   * @param {String}  params.indexName  The name of the index to use. If not provided it will be run over the table.
   * @param {Number}  params.limit      Indicates the number of results that will be returned at most by the query
   *                                    If not defined then the result will be at most 1 MB of data. This option will
   *                                    be over-ruled by DynamoDB if the results reach 1 MB of data before reaching
   *                                    the limit.
   * @returns {Promise} Thenble promise with the results of the query request.
   */
  const _query = (params) => (
    DocumentClient
    .query(Object.assign({
      TableName: Table,
      KeyConditionExpression: params.expression,
      ExpressionAttributeValues: params.values,
      ExpressionAttributeNames: params.names ? params.names : {
        '#HashKey': HashKey,
        '#RangeKey': RangeKey,
      },
    },
      params.indexName ? {IndexName: params.indexName} : {},
      params.filter ? {FilterExpression: params.filter} : {},
      params.startKey ? {ExclusiveStartKey: params.startKey} : {},
      params.attributes ? {AttributesToGet: params.attributes} : {},
      params.limit ? {Limit: params.limit} : {}
    ))
    .promise()
  )
  /**
   * @function _scan
   * @description Queries the table according to the given query expression.
   *              The results can also be:
   *              - Limited: Using the query limit attribute.
   *              - Indexed: Run on an index indicated by the indexName query attribute.
   *              - Picked: Only fields inculded in the query attributes attribute will be returned.
   * @param {Object}  params Query configuration object. 
   * @param {String!}   expression Expression complying with all KeyConditionExpression rules.
   * @param {Object}    values     Dictionary of all the named values used on the expression attribute.
   * @param {Object}    names      Dictionary of all the named keys used on the expression attribute.
   * @param {Array}     attributes List of attributes to pick from the responses.
   * @param {Object}    startKey   Key indicating where the query should start looking on the table.
   * @param {String}    indexName  The name of the index to use. If not provided it will be run over the table.
   * @param {Number}    limit      Indicates the number of results that will be returned at most by the query
   *                               If not defined then the result will be at most 1 MB of data. This option will
   *                               be over-ruled by DynamoDB if the results reach 1 MB of data before reaching
   *                               the limit.
   * @returns {Promise} Thenble promise with the results of the scan request.
   */
  const _scan = (params) => (
    DocumentClient
    .scan(Object.assign({
      TableName: Table,
    }, 
      params && params.expression ? {FilterExpression: params.expression} : {},
      params && params.values ? {ExpressionAttributeValues: params.values} : {},
      params && params.names ? {ExpressionAttributeNames: params.names} : {},
      params && params.startKey ? {ExclusiveStartKey: params.startKey} : {},
      params && params.indexName ? {IndexName: params.indexName} : {},
      params && params.limit ? {Limit: params.limit} : {},
      params && params.attributes ? {AttributesToGet: params.attributes} : {}
    ))
    .promise()
  )
  // Return
  // ------
  return {
    get: _get,
    put: _put,
    update: _update,
    delete: _delete,
    query: _query,
    scan: _scan,
  }
}

exports = module.exports = Model
