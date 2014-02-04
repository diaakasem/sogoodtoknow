'use strict'

describe 'Controller: UploadedCtrl', () ->

  # load the controller's module
  beforeEach module 'nodeExecuterApp'

  UploadedCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    UploadedCtrl = $controller 'UploadedCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', () ->
    expect(scope.awesomeThings.length).toBe 3
