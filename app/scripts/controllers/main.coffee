"use strict"
controller = ($scope, $http) ->
  promise = $http method: 'get', url: '/project/'
  promise.success (result)->
    $scope.articles = result

angular.module("nodeExecuterApp")
.controller "MainCtrl", controller
