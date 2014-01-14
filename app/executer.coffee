sys = require 'sys'
exec = require('child_process').exec

class exports.Executer
  constructor: ->
    @callbacks = {}

  notify: (name)->
    if name
      callbacks = @callbacks[name]
    else
      console.log "No name provided"

    return (error, stdout, stderr)=>
      @puts error, stdout, stderr
      for callback in callbacks
        callback error, stdout, stderr

  addCallback: (name, callback)->
    @callbacks[name] ?= []
    if callback
      @callbacks[name].push callback
    else
      console.log "No callback for #{name}"

  execute: (cmd, callback)->
    @addCallback cmd.name, callback
    exec cmd.command, @notify(cmd.name)

  puts: (error, stdout, stderr)->
    if error
      sys.puts(stderr)
    else
      sys.puts(stdout)

