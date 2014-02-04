'use strict'

controller = (scope)->

angular.module('nodeExecuterApp')
  .directive 'tabnav', ->
    templateUrl: './views/directives/tabnav.html'
    restrict: 'E'
    scope:
      selected: '@'
      filter: '='
    controller: ['$scope', controller]
