'use strict';

describe('Controller: NewCtrl', function() {

  // load the controller's module
  beforeEach(module('nodeExecuterApp'));

  let NewCtrl = {};
  let scope = {};

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    return NewCtrl = $controller('NewCtrl', {
      $scope: scope
    });}));

  return it('should attach a list of awesomeThings to the scope', () => expect(scope.awesomeThings.length).toBe(3));
});
