import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors';
import errorHandler from 'errorhandler'
import router from './router.js';
import { config } from './node/db.js'

const __dirname = path.resolve();

const app = express()
app.use('/', express.static(path.join(__dirname, 'app')))
const bodyParserConfig = {
  limit: '999kb',
  extended: true,
  parameterLimit: 5000000
}
app.use(cors())
app.use(bodyParser.json(bodyParserConfig))
app.use(bodyParser.urlencoded(bodyParserConfig))
app.use(errorHandler())
const connectionUrl = `${process.env.mongodb}`
app.set('db connect string', connectionUrl)

async function init () {
  await config(app)
  await router(app);
  return app.listen(4000)
}
init()
