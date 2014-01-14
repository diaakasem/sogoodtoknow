{Executer} = require './executer'

class exports.Say extends Executer

  say: (something, callback)->
    cmd =
      name: 'say'
      command: "say #{something}"
    @execute(cmd, callback)
  
