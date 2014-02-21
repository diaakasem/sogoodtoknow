{Ping} = require './ping'
{Say} = require './say'

p = new Ping()
s = new Say()

lastResult = null

callback = (error, stdout, stderr)->
  if error
    if lastResult
      lastResult = false
      #s.say 'I am not online'
      s.arSay 'النت قطع'
  else
    unless lastResult
      lastResult = true
      #s.say 'Horray, I am online'
      s.arSay 'النت رجع'

setInterval ->
  p.pingGoogle callback
, 1000

