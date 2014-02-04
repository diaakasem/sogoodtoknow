"use strict"
controller = (root, scope, http, params, timeout) ->

  scope.project = {}

  promise = http
    method: 'get'
    url: "/project/#{params.name}"
  promise.success (result)=>
    scope.project = result


angular.module("nodeExecuterApp")
.controller 'UploaddataCtrl', ['$rootScope', '$scope', '$http', '$routeParams', '$timeout', controller]
