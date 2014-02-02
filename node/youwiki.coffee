{Wikipedia} = require './wikipedia'
{Say} = require './say'
path = require 'path'
mkdirp = require 'mkdirp'
_ = require 'lodash'
gm = require 'gm'
im = require 'imagemagick'

speaker = new Say('en')

cmdString = (text)->
  text = text.replace /"/g, ' '
  text = text.replace /'/g, ''
  text = text.replace /\(/g, '\\('
  text = text.replace /\)/g, '\\)'
  text = text.replace /\|/g, '\\| '
  text = text.replace /\[/g, '\\['
  text = text.replace /\]/g, '\\]'

pad = (num, size=2) ->
  s = num + ""
  s = "0" + s  while s.length < size
  s


fs = require("fs")
request = require("request")
download = (uri, filename, callback) ->
  r = request(uri)
  r.pipe fs.createWriteStream(filename)
  r.on 'end', callback


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
    speaker.produce audioFile, textFile, (file)->
      fs.unlink audioFile
      console.log 'Done' # + file

  downloadImages: (uri, images)->
    images = _.filter images, (image)->
      image.name.indexOf('svg') < 0
    i = 0
    downloadImage = ->
      return  if i >= images.length
      img = images[i++]
      dot = img.name.lastIndexOf('.')
      padded = pad(i)
      ext = img.name.substring(dot)
      out = path.join(uri, padded + ext)
      download img.url, out, ->
        im.resize
          srcPath: out
          dstPath: path.join(uri, padded + '_resized' + ext)
          width: 500
          height: 500
        , (err, stdout, stderr)->
          throw err  if err
          fs.unlink out
          downloadImage()
    downloadImage()

  nameOf: (title)->
    name = title.toLowerCase()
    name.replace /\s/g, '_'
    
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

