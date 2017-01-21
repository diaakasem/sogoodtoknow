
_ = require 'lodash'
yahoo = require('./node/yahoo')
Yahoo = new yahoo.Yahoo()
twitter = require('./node/twitter')
Twitter = new twitter.Twitter()
path = require('path')
fs = require('fs')
lodash = require('lodash')
db = require './node/db'
{Manager} = require './node/youwiki'
mongoose = require('mongoose')

deleteFolderRecursive = (path) ->
  files = []
  if fs.existsSync(path)
    files = fs.readdirSync(path)
    files.forEach (file, index) ->
      curPath = path + "/" + file
      if fs.statSync(curPath).isDirectory() # recurse
        deleteFolderRecursive curPath
      else # delete file
        fs.unlinkSync curPath
      return

    fs.rmdirSync path
  return


projectsPath = path.join(__dirname, 'app', 'projects')

express = require("express")
busboy = require('express-busboy')
bodyParser = require('body-parser')
errorHandler = require('errorhandler')
app = express()
app.set('view engine', 'ejs')
app.use '/', express.static(__dirname + '/app')
bodyParserConfig =
  limit: '999kb',
  extended: true,
  parameterLimit: 5000000
app.use(bodyParser.json(bodyParserConfig))
app.use(bodyParser.urlencoded(bodyParserConfig))
app.use(errorHandler())
app.engine('html', require('ejs').renderFile)
app.set('db connect string', 'mongodb://localhost/dwikia')
db.config(app)
ProjectModel = mongoose.model('Project')

app.get '/wikipedia/build/:name', (req, res)->
  res.json({ hello: 'world' })


m = new Manager()

end = (req, res)->
  (meta)->
    return res.json({result: "error"})  if meta is 'error'
    meta.status = 'created'
    project = new ProjectModel()
    project = _.extend project, meta
    project.save (err, obj)->
      return res.json {"error": err}  if err
      console.log "Returning result..."
      res.json {result: "done"}

app.post '/build/url/', (req, res)->
  url = req.body.url
  m.run(url, end(req, res))

app.post '/build/random/', (req, res)->
  m.run('random', end(req, res))

app.post '/build/today/', (req, res)->
  m.run(null, end(req, res))

app.post '/project/', (req, res)->
  #name = req.body.name
  status = req.body.status
  #projects = fs.readdirSync(projectsPath)
  ProjectModel.find {status: status}, (err, list)->
    res.json list

app.delete '/project/id/:id', (req, res)->
  id = req.params.id
  ProjectModel.remove {_id: id}, (err, project)->
    res.json project

app.delete '/project/:name', (req, res)->
  name = req.params.name
  ProjectModel.remove {name: name}, (err, project)->
    deleteFolderRecursive path.join('app', 'projects', name)
    res.json project

app.post '/project/:id', (req, res)->
  status = req.body.status
  ProjectModel.update {_id: req.params.id}, {status: status}, (err, project)->
    res.json project

app.get '/project/:id', (req, res)->
  id = req.params.id
  ProjectModel.findOne {_id: id}, (err, project)->
    res.json project

app.get '/trends/:name', (req, res)->
  name = req.params.name
  Twitter.placeTrends name, (err, obj)->
    console.log obj
    res.send obj

#app.get '/trends/:name', (req, res)->
  #name = req.params.name
  #console.log name
  #Yahoo.woeid  name, (err, woeid)->
    #if err
      #return console.error 'Error yahoo', err
    #Twitter.trendsFor woeid, (err, obj)->
      #console.log obj
      #res.send obj


app.listen 4000
