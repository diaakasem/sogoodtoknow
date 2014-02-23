"use strict"
app = angular.module("nodeExecuterApp", [])
app.config ($routeProvider) ->
  $routeProvider.when "/",
    templateUrl: "views/main.html"
    controller: "MainCtrl"
  .when '/project/:name',
    templateUrl: 'views/project.html'
    controller: 'ProjectCtrl'
  .when '/new',
    templateUrl: 'views/new.html'
    controller: 'NewCtrl'
  .when '/uploaded',
    templateUrl: 'views/uploaded.html'
    controller: 'UploadedCtrl'
  .when '/videoed',
    templateUrl: 'views/videoed.html'
    controller: 'VideoedCtrl'
  .when '/uploaddata/:name',
    templateUrl: 'views/uploaddata.html'
    controller: 'UploaddataCtrl'
  .when '/trends',
    templateUrl: 'views/trends.html'
    controller: 'TrendsCtrl'
  .otherwise redirectTo: "/"

controller = (root)->
  root.audioElement = document.createElement('audio')
  root.$on '$routeChangeStart', ->
    root.audioElement.pause()

app.run ['$rootScope', controller]

