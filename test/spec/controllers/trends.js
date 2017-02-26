'use strict';

describe('Controller: TrendsCtrl', function() {

  // load the controller's module
  beforeEach(module('nodeExecuterApp'));

  let TrendsCtrl = {};
  let scope = {};

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    return TrendsCtrl = $controller('TrendsCtrl', {
      $scope: scope
    });}));

  return it('should attach a list of awesomeThings to the scope', () => expect(scope.awesomeThings.length).toBe(3));
});
