'use strict'

describe 'Controller: ProjectCtrl', () ->

  # load the controller's module
  beforeEach module 'nodeExecuterApp'

  ProjectCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    ProjectCtrl = $controller 'ProjectCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', () ->
    expect(scope.awesomeThings.length).toBe 3
