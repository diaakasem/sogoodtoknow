import _ from 'lodash'
import path from 'path'
import fs from 'fs'
import mongoose from 'mongoose'
import express from 'express'
import bodyParser from 'body-parser'
import errorHandler from 'errorhandler'
import ejs from 'ejs'

import TwitterClass from './node/twitter.js'
import db from './node/db.js'
import Manager from './node/youwiki.js'

const __dirname = path.resolve();

const Twitter = new TwitterClass()

function deleteFolderRecursive (path) {
  let files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach(function (file, index) {
      const curPath = path + '/' + file
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

const app = express()
app.set('view engine', 'ejs')
app.use('/', express.static(path.join(__dirname, 'app')))
const bodyParserConfig = {
  limit: '999kb',
  extended: true,
  parameterLimit: 5000000
}
app.use(bodyParser.json(bodyParserConfig))
app.use(bodyParser.urlencoded(bodyParserConfig))
app.use(errorHandler())
// let connectionUrl = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;
const connectionUrl = `${process.env.mongodb}`
app.engine('html', ejs.renderFile)
app.set('db connect string', connectionUrl)

async function init () {
  await db.config(app)
  const ProjectModel = mongoose.model('Project')
  app.get('/wikipedia/build/:name', (req, res) => res.json({ hello: 'world' }))
  const m = new Manager()
  const end = (req, res) => {
    return async function (err, meta) {
      if (err) {
        return res.json({ result: 'error' })
      }
      meta.status = 'created'
      let project = new ProjectModel()
      project = _.extend(project, meta)
      try {
        await project.save()
        console.log('Returning result...')
        return res.json({ result: 'done' })
      } catch (err) {
        return res.json({ error: err })
      }
    }
  }

  app.post('/build/url/', async function (req, res) {
    const { url } = req.body
    const results = await m.run(url, end(req, res))
    return results
  })

  app.post('/build/random/', (req, res) => m.run('random', end(req, res)))

  app.post('/build/today/', (req, res) => m.run(null, end(req, res)))

  app.post('/project/', async function (req, res) {
    const { status } = req.body
    const list = await ProjectModel.find({ status })
    return res.status(200).send(list)
  })

  app.delete('/project/id/:id', async function (req, res) {
    const { id } = req.params
    const project = await ProjectModel.remove({ _id: id })
    return res.json(project)
  })

  app.delete('/project/:name', async function (req, res) {
    const { name } = req.params
    const project = await ProjectModel.remove({ name })
    await deleteFolderRecursive(path.join('app', 'projects', name))
    return res.json(project)
  })

  app.post('/project/:id', async function (req, res) {
    const { status } = req.body
    const project = await ProjectModel.update({ _id: req.params.id }, { status })
    return res.json(project)
  })

  app.get('/project/:id', async function (req, res) {
    const { id } = req.params
    const project = await ProjectModel.findOne({ _id: id })
    return res.json(project)
  })

  app.get('/trends/:name', async function (req, res) {
    const { name } = req.params
    try {
      const obj = await Twitter.placeTrends(name)
      console.log(obj)
      return res.send(obj)
    } catch (err) {
      console.error(err)
    }
  })

  return app.listen(4000)
}
init()
