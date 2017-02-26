'use strict';

describe('Controller: YoutubedCtrl', function() {

  // load the controller's module
  beforeEach(module('nodeExecuterApp'));

  let YoutubedCtrl = {};
  let scope = {};

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    return YoutubedCtrl = $controller('YoutubedCtrl', {
      $scope: scope
    });}));

  return it('should attach a list of awesomeThings to the scope', () => expect(scope.awesomeThings.length).toBe(3));
});
