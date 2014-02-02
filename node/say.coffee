{Executer} = require './executer'

class exports.Say extends Executer

  voices:
    en: ['samantha', 'tom', 'ava', 'allison']

  constructor: (@defaultlang)->
    super()

  voice: (lang=@defaultlang)->
    arr = if lang then @voices[lang] else []
    return null  unless arr.length
    res = arr[Math.floor(Math.random() * arr.length)]
    console.log "Speaking #{res} voice."
    res

  say: (something, callback)->
    v = @voice()
    cmd =
      name: 'say'
      command: "say #{something}"
    if v
      cmd.command += " -v #{v}"
    @execute(cmd, callback)

  toMp3: (file, callback)->
    cmd =
      name: 'convert'
      command: "ffmpeg -i \"#{file}\" -f mp3 -acodec libmp3lame -ab 192000 -ar 44100 \"#{file}\".mp3"

    @execute cmd, ->
      callback?(file + ".mp3")

  produce: (audioFile, textFile, callback)->
    v = @voice()
    cmd =
      name: 'say'
      command: "say -o \"#{audioFile}\" -f \"#{textFile}\" "
    if v
      cmd.command += "-v #{v} "

    @execute cmd, =>
      @toMp3 audioFile, (file)=>
        callback?(file)
