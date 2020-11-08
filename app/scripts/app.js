"use strict";
const app = angular.module("nodeExecuterApp", ['ngRoute']);
app.config(($routeProvider, $locationProvider) => {
  $locationProvider.hashPrefix('');
  $routeProvider.when("/", {
    templateUrl: "views/main.html",
    controller: "MainCtrl"
  }).when('/project/:id', {
    templateUrl: 'views/project.html',
    controller: 'ProjectCtrl'
  }).when('/new', {
    templateUrl: 'views/new.html',
    controller: 'NewCtrl'
  }).when('/uploaded', {
    templateUrl: 'views/uploaded.html',
    controller: 'UploadedCtrl'
  }).when('/videoed', {
    templateUrl: 'views/videoed.html',
    controller: 'VideoedCtrl'
  }).when('/uploaddata/:id', {
    templateUrl: 'views/uploaddata.html',
    controller: 'UploaddataCtrl'
  }).when('/trends', {
    templateUrl: 'views/trends.html',
    controller: 'TrendsCtrl'
  }).otherwise({redirectTo: "/"});
});

app.run(function($rootScope){
  $rootScope.audioElement = document.createElement('audio');
  $rootScope.backgroundAudio = document.createElement('audio');
  $rootScope.backgroundTheme = 'background';
  $rootScope.rand = Math.random();
  $rootScope.backgroundThemeName = $rootScope.backgroundTheme;
  return $rootScope.$on('$routeChangeStart', () => {
      $rootScope.audioElement.pause();
      $rootScope.backgroundAudio.pause();
  });
});

