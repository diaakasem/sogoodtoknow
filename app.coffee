
path = require('path')
fs = require('fs')
lodash = require('lodash')
projectsPath = path.join(__dirname, 'app', 'projects')

express = require("express")
app = express()
app.set('view engine', 'ejs')
app.use '/', express.static(__dirname + '/app')
app.engine('html', require('ejs').renderFile)
app.use(require('nodejs-fastload').loader('/l'))

app.get '/wikipedia/build/:name', (req, res)->
  res.json({ hello: 'world' })


app.get '/project/', (req, res)->
  projects = fs.readdirSync(projectsPath)
  res.json projects

app.get '/project/:name', (req, res)->
  name = req.params.name
  project = path.join(projectsPath, name)
  textFile = path.join(project, 'text.txt')
  imagesDir = path.join(project, 'images')
  audio = path.join('projects', name, 'audio.aiff.mp3')
  text = fs.readFileSync(textFile) + ""
  images = fs.readdirSync(imagesDir)
  res.json
    name: name
    text: text
    images: images
    audio: audio


app.listen 3000
