{Wikipedia} = require './wikipedia'
{Say} = require './say'
path = require 'path'
mkdirp = require 'mkdirp'

speaker = new Say('en')

cmdString = (text)->
  text = text.replace /"/g, ' '
  text = text.replace /'/g, ''
  text = text.replace /\(/g, ' '
  text = text.replace /\)/g, ' '
  text = text.replace /\|/g, ' '
  text = text.replace /\[/g, ' '
  text = text.replace /\]/g, ' '


fs = require("fs")
request = require("request")
download = (uri, filename) ->
  request(uri).pipe fs.createWriteStream(filename)


class Manager

  langs: ['en']

  constructor: ->
    @wiki = new Wikipedia()

  pathOf: (title)->
    path.join __dirname, '..', 'app', 'projects', title

  structure: (title)->
    p = @pathOf title
    mkdirp.sync p
    mkdirp.sync path.join p, 'images'
    root: p
    images: path.join p, 'images'
    audio: path.join p, 'audio.aiff'
    text: path.join p, 'text.txt'

  speak: (title, textFile, audioFile)->
    title = cmdString(title)
    speaker.produce audioFile, textFile, (file)->
      fs.unlink audioFile
      console.log 'Done : ' + file

  downloadImages: (uri, images)->
    for img, i in images
      dot = img.name.lastIndexOf('.')
      download img.url, path.join(uri, i + img.name.substring(dot))

  nameOf: (title)->
    name = title.toLowerCase()
    name = name.replace /\s/g, '_'
    name = cmdString name
    name
    
  build: (title, text, images)->
    project = @structure(@nameOf(title))
    @downloadImages project.images, images
    fs.writeFileSync project.text, text
    @speak title, project.text, project.audio

  run: (url)->
    if url
      @wiki.scrape url, (title, text, images)=>
        @build(title, text, images)
    else
      for lang in @langs
        @wiki.dailyArticle lang, (title, text, images)=>
          @build(title, text, images)

m = new Manager()
if process.argv.length > 1
  m.run(process.argv[2])
else
  m.run()

