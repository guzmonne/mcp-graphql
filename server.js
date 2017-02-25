const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/index.js')
const {PORT} = require('./variables.js')
const {RUNNING} = require('./messages.js')
const loggingMiddleware = require('./middleware/loggingMiddleware.js')

const app = express()

app.use(loggingMiddleware)

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
  pretty: true,
}))

app.listen(PORT, () => console.log(RUNNING))
