'use strict'

yahoo_app_id = 'vCu4FUjV34HSXktB0RHLPOjtgQPm3vnh0zchQcgX.ow8THogzl3Nta_rAC4-'
controller = (scope, http) ->
  scope.trendsFor = (place)->
    promise = http.get('/trends/' + place)
    promise.success (res)->
      if not res or not res.length
        console.log "No result for " + place
        scope.trends = []
      else
        scope.trends = res[0].trends

    promise.error (res)->
      console.error res

angular.module('nodeExecuterApp')
  .controller 'TrendsCtrl', ['$scope', '$http', controller]
