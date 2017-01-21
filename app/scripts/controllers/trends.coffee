'use strict'

controller = (scope, http) ->
  scope.trendsFor = (place)->
    promise = http.get('/trends/' + place)
    promise.success (res)->
      console.log res
      if not res or not res.length
        console.log "No result for " + place
        scope.trends = []
      else
        scope.trends = res

    promise.error (res)->
      console.error res

angular.module('nodeExecuterApp')
  .controller 'TrendsCtrl', ['$scope', '$http', controller]
