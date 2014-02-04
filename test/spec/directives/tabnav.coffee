'use strict'

describe 'Directive: tabnav', () ->

  # load the directive's module
  beforeEach module 'nodeExecuterApp'

  scope = {}

  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<tabnav></tabnav>'
    element = $compile(element) scope
    expect(element.text()).toBe 'this is the tabnav directive'
