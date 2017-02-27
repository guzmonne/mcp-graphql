const app = require('./app.js')
const {PORT} = require('./variables.js')
const {RUNNING} = require('./messages.js')

app.listen(PORT, () => console.log(RUNNING))
