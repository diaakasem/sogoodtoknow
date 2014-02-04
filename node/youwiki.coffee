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


class exports.Manager

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

  speak: (title, textFile, audioFile, callback)->
    speaker.produce audioFile, textFile, (file)->
      fs.unlink audioFile
      callback?(file)

  downloadImages: (uri, images, callback)->
    # For now we do not work with svg
    images = _.filter images, (image)->
      image.name.indexOf('svg') < 0
    i = 0
    newImages = []
    downloadImage = ->
      if i >= images.length
        callback?(newImages)
        return
      img = images[i++]
      dot = img.name.lastIndexOf('.')
      padded = pad(i)
      ext = img.name.substring(dot)
      out = path.join(uri, padded + ext)
      download img.url, out, ->
        name = padded + '_resized' + ext
        local = path.join(uri, name)
        im.resize
          srcPath: out
          dstPath: local
          width: 500
          height: 500
        , (err, stdout, stderr)->
          img.name = name
          img.status = 'success'
          if err
            img.status = 'error'
            fs.unlink path.join(uri, name)
          newImages.push img
          fs.unlink out
          downloadImage()
    downloadImage()

  nameOf: (title)->
    name = title.toLowerCase()
    name.replace /\s/g, '_'
    
  build: (meta, onEnd)->
    meta.name = @nameOf(meta.title)
    project = @structure(meta.name)

    callback = _.after 2, ->
      onEnd(meta)

    imagesDownloaded = (images)->
      meta.images = images
      callback()
    speakDone = (audio)->
      meta.audio = audio
      callback()
    @downloadImages project.images, meta.images, imagesDownloaded
    fs.writeFileSync project.text, meta.text
    @speak meta.title, project.text, project.audio, speakDone

  run: (url, onEnd)->
    #callback = (title, text, images)=>
    callback = (metadata)=>
      @build(metadata, onEnd)

    if url and url is 'random'
      @wiki.randomEn callback
    else if url and url isnt 'random'
      @wiki.scrape url, callback
    else
      for lang in @langs
        @wiki.dailyArticle lang, callback

