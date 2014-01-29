{Executer} = require './executer'

class exports.Say extends Executer

  voices:
    en: ['samantha', 'tom']

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

  produce: (audioFile, textFile, callback)->
    v = @voice()
    cmd =
      name: 'say'
      command: "say -o \"#{audioFile}\" -f \"#{textFile}\" "
    if v
      cmd.command += "-v #{v} "

    console.log cmd.command
    @execute(cmd, callback)
