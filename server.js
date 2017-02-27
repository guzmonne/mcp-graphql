const express = require('express')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')
const schema = require('./graphql/')
const {PORT} = require('./variables.js')
const {RUNNING} = require('./messages.js')
const app = express()

app.use(cors())

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
  pretty: true,
}))

app.listen(PORT, () => console.log(RUNNING))
