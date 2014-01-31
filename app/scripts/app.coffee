"use strict"
app = angular.module("nodeExecuterApp", [])
app.config ($routeProvider) ->
  $routeProvider.when "/",
    templateUrl: "views/main.html"
    controller: "MainCtrl"
  .when '/project/:name',
    templateUrl: 'views/project.html'
    controller: 'ProjectCtrl'
  .otherwise redirectTo: "/"

