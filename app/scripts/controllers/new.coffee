'use strict'

controller = (scope, http, location)->
  
  scope.wikipedia = ''
  scope.continus = no
  scope.inprogress = no

  exe = (url, data)->
    scope.inprogress = yes
    promise = http
      method: 'post'
      url: url
      data: data

    promise.success (result)->
      scope.inprogress = no
      if scope.continus and url.indexOf('random') > 0
        scope.random()
      else
        location.path '/'

    promise.error (error)->
      scope.inprogress = no
      console.log error

  scope.process = ->
    exe '/build/url/', {url: scope.wikipedia}
    
  scope.today = ->
    exe '/build/today/'

  scope.random = ->
    exe '/build/random/'


angular.module('nodeExecuterApp')
  .controller 'NewCtrl', ['$scope', '$http', '$location', controller]
