{Executer} = require './executer'

class exports.Ping extends Executer

  ping: (website, callback)->
    cmd =
      name: 'ping'
      command: "ping -c 3 #{website}"
    @execute(cmd, callback)
  
  pingGoogle: (callback)->
    @ping 'google.com', callback
    
