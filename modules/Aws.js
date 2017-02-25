/**
 * Module that initialize AWS services to use through the app.
 */
const AWS = require('aws-sdk')

const config = {
  region: 'us-east-1',
}

const DynamoDB = new AWS.DynamoDB(config)

const DocumentClient = new AWS.DynamoDB.DocumentClient(config)

exports = module.exports = {
  DynamoDB: DynamoDB,
  DocumentClient: DocumentClient,
}
