{Ping} = require './ping'
{Say} = require './say'

p = new Ping()
s = new Say()

lastResult = null

callback = (error, stdout, stderr)->
  if error
    if lastResult
      lastResult = false
      s.say 'Cenergy is offline.'
  else
    unless lastResult
      lastResult = true
      s.say 'Cenergy is online.'

setInterval ->
  p.pingEam callback
, 1000

