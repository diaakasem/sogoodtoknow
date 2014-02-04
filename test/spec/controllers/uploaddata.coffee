'use strict'

describe 'Controller: UploaddataCtrl', () ->

  # load the controller's module
  beforeEach module 'nodeExecuterApp'

  UploaddataCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    UploaddataCtrl = $controller 'UploaddataCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', () ->
    expect(scope.awesomeThings.length).toBe 3
