'use strict'

describe 'Controller: NewCtrl', () ->

  # load the controller's module
  beforeEach module 'nodeExecuterApp'

  NewCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    NewCtrl = $controller 'NewCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', () ->
    expect(scope.awesomeThings.length).toBe 3
