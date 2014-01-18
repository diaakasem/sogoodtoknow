{Ping} = require './ping'
{Say} = require './say'

p = new Ping()
s = new Say()

lastResult = null

callback = (error, stdout, stderr)->
  if error
    if lastResult
      lastResult = false
      s.say 'I am not online'
  else
    unless lastResult
      lastResult = true
      s.say 'Horray, I am online'

setInterval ->
  p.pingGoogle callback
, 1000

