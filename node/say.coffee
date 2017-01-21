{Executer} = require './executer'
fs = require 'fs'

class exports.Say extends Executer

  voices:
    #en: ['tom', 'ava', 'karen', 'lee', 'serena']
    en: ['tom', 'ava']
    ar: ['tarik']

  constructor: (@defaultlang)->
    super()

  voice: (lang=@defaultlang)->
    arr = if lang then @voices[lang] else []
    return null  unless arr.length
    arr[Math.floor(Math.random() * arr.length)]

  arSay: (something, callback)->
    v = @voice('ar')
    cmd =
      name: 'say'
      command: "say #{something}"
    if v
      cmd.command += " -v #{v}"
    @execute(cmd, callback)

  say: (something, callback)->
    v = @voice()
    cmd =
      name: 'say'
      command: "say #{something}"
    if v
      cmd.command += " -v #{v}"
    @execute(cmd, callback)

  produce: (audioFile, textFile, callback)->
    audio = {}
    v = @voice()
    audio.voice = v
    cmd =
      name:  "say -o \"#{audioFile}\" -f \"#{textFile}\" "
      command: "say -o \"#{audioFile}\" -f \"#{textFile}\" "
    if v
      cmd.command += "-v #{v} "

    @execute cmd, =>
      @toMp3 audioFile, (file)=>
        audio.file = file
        callback?(audio)

  toMp3: (file, callback)->
    fs.unlink "#{file}.mp3", =>
      cmd =
        name:  "ffmpeg -i \"#{file}\" -f mp3 -acodec libmp3lame -ab 192000 -ar 44100 \"#{file}\".mp3"
        command: "ffmpeg -i \"#{file}\" -f mp3 -acodec libmp3lame -ab 192000 -ar 44100 \"#{file}\".mp3"

      @execute cmd, ->
        callback?(file + ".mp3")
