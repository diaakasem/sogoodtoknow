'use strict'

describe 'Controller: YoutubedCtrl', () ->

  # load the controller's module
  beforeEach module 'nodeExecuterApp'

  YoutubedCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    YoutubedCtrl = $controller 'YoutubedCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', () ->
    expect(scope.awesomeThings.length).toBe 3
