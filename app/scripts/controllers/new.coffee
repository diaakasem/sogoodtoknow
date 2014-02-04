'use strict'

controller = (scope, http, location)->
  
  scope.wikipedia = ''

  exe = (url, data)->
    promise = http
      method: 'post'
      url: url
      data: data

    promise.success (result)->
      console.log result
      location.path '/'

    promise.error (error)->
      console.log error

  scope.process = ->
    exe '/build/url/', {url: scope.wikipedia}
    
  scope.today = ->
    exe '/build/today/'

  scope.random = ->
    exe '/build/random/'


angular.module('nodeExecuterApp')
  .controller 'NewCtrl', ['$scope', '$http', '$location', controller]
