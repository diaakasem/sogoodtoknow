"use strict"
controller = (scope, http, location) ->
  promise = http
    method: 'post'
    url: '/project/'
    data:
      status: 'videoed'

  scope.by_name = ''
  promise.success (result)->
    scope.articles = result

angular.module("nodeExecuterApp")
.controller 'VideoedCtrl',
  ['$scope', '$http', '$location', controller]
