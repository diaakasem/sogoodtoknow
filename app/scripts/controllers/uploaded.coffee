"use strict"
controller = (scope, http, location) ->
  promise = http
    method: 'post'
    url: '/project/'
    data:
      status: 'uploaded'

  scope.by_name = ''
  promise.success (result)->
    scope.articles = result

angular.module("nodeExecuterApp")
.controller 'UploadedCtrl',
  ['$scope', '$http', '$location', controller]
